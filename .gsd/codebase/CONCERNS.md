# Codebase Concerns

**Analysis Date:** 2026-03-09

## Tech Debt

**Game runtime singleton and module-scoped state:**
- Issue: `frontend/src/game/engine.ts` mantém `context`, `loopController`, `player`, `wave`, `projectiles`, `activeDrops`, `pendingStage`, `currentRunId` e `currentRunSeed` como estado global mutável e também escreve diretamente em `frontend/src/state/gameStore.ts`.
- Files: `frontend/src/game/engine.ts`, `frontend/src/state/gameStore.ts`, `frontend/src/App.tsx`
- Impact: acoplamento alto entre render, loop, persistência e UI; dificulta testes isolados, reuso da engine e múltiplas instâncias do jogo na mesma página.
- Fix approach: transformar a engine em fábrica por instância, encapsular estado por sessão e expor ações nomeadas em vez de mutações soltas no store.

**Bootstrap da aplicação concentrado no componente raiz:**
- Issue: `frontend/src/App.tsx` faz bootstrap do canvas, subscreve stores, hidrata progresso, hidrata configurações, persiste mudanças e controla tela de loja.
- Files: `frontend/src/App.tsx`, `frontend/src/state/settingsStore.ts`, `frontend/src/services/settingsService.ts`, `frontend/src/services/shopPersistenceService.ts`
- Impact: ponto único de regressão; mudanças em ciclo de vida, persistência ou UX tendem a colidir no mesmo arquivo.
- Fix approach: extrair hooks de bootstrap, ações de domínio e adaptadores de persistência para reduzir o tamanho e a responsabilidade do componente.

## Known Bugs

**Highscore persistido não é reidratado na inicialização:**
- Symptoms: o jogo salva score máximo em `frontend/src/services/highscoreService.ts`, mas a UI inicializa com `highScore: 0` em `frontend/src/state/gameStore.ts` e `frontend/src/App.tsx` não chama `getLocalHighscore()`.
- Files: `frontend/src/services/highscoreService.ts`, `frontend/src/state/gameStore.ts`, `frontend/src/App.tsx`
- Trigger: fechar e reabrir a aplicação após registrar um highscore local.
- Workaround: nenhum no runtime atual; o valor volta a aparecer apenas se uma nova run ultrapassar o score salvo.

**Endpoint remoto de leaderboard não existe no workspace:**
- Symptoms: `frontend/src/services/leaderboardApi.ts` assume `GET/POST /api/leaderboard`, mas o workspace contém apenas o contrato `specs/001-space-invaders-modern-ui/contracts/leaderboard-openapi.yaml` e nenhuma implementação de API.
- Files: `frontend/src/services/leaderboardApi.ts`, `frontend/src/services/highscoreSyncService.ts`, `specs/001-space-invaders-modern-ui/contracts/leaderboard-openapi.yaml`
- Trigger: qualquer integração futura que passe a chamar `fetchLeaderboard()` ou `syncHighscoreIfConsented()`.
- Workaround: manter a sincronização remota desabilitada ou injetar um `baseUrl` apontando para um backend externo real.

## Security Considerations

**Trust model fraco para leaderboard remoto:**
- Risk: o cliente pode enviar `score`, `playerName` e `timestamp` arbitrários em `frontend/src/services/leaderboardApi.ts` sem qualquer assinatura, autenticação ou prova de integridade.
- Files: `frontend/src/services/leaderboardApi.ts`, `frontend/src/services/highscoreSyncService.ts`
- Current mitigation: nenhuma mitigação server-side é detectável no workspace.
- Recommendations: validar score no servidor, aplicar rate limiting, autenticação e rejeição de payloads impossíveis.

## Performance Bottlenecks

**Resolução de colisão escala com o número de projéteis e inimigos:**
- Problem: `resolvePlayerProjectileCollisions()` faz `findIndex()` sobre inimigos para cada projétil do jogador, enquanto `resolveEnemyProjectileHitsPlayer()` e `resolveBossProjectileCollisions()` percorrem novamente a lista completa de projéteis no mesmo tick.
- Files: `frontend/src/game/systems/collisionSystem.ts`, `frontend/src/game/engine.ts`, `frontend/src/game/systems/waveSystem.ts`
- Cause: múltiplas varreduras lineares por frame, cópias de arrays e `splice()` em estruturas quentes do loop fixo.
- Improvement path: particionar projéteis por origem uma vez por tick, reduzir cópias temporárias e introduzir broad phase simples se a contagem de entidades crescer.

**Adaptação de performance incompleta e parcialmente código morto:**
- Problem: `frontend/src/game/perf/fpsProbe.ts` e partes de `frontend/src/game/systems/performanceAdaptation.ts` não estão conectados ao loop; em `frontend/src/game/systems/waveSystem.ts` o modo é fixado por estágio, não por FPS real.
- Files: `frontend/src/game/perf/fpsProbe.ts`, `frontend/src/game/systems/performanceAdaptation.ts`, `frontend/src/game/systems/waveSystem.ts`
- Cause: infraestrutura de medição existe, mas não retroalimenta limites ou taxa-alvo em runtime.
- Improvement path: ligar a sonda de FPS à engine e aplicar degradação adaptativa real baseada em métricas observadas.

## Fragile Areas

**Chamadas assíncronas sem tratamento explícito de erro:**
- Files: `frontend/src/App.tsx`, `frontend/src/game/engine.ts`, `frontend/src/lib/indexedDb.ts`, `frontend/src/lib/telemetry.ts`, `frontend/src/services/settingsService.ts`, `frontend/src/services/shopPersistenceService.ts`, `frontend/src/services/highscoreService.ts`
- Why fragile: o código usa `void ...then(...)` e `void save...` em hidratação e persistência; falhas de IndexedDB, modo privado, quota excedida ou erros de browser podem gerar rejeições não tratadas e divergência silenciosa entre estado em memória e armazenamento.
- Safe modification: centralizar acesso a storage em um adapter resiliente com `try/catch`, fallback e telemetria local de falha.
- Test coverage: os testes de persistência em `frontend/tests/integration/us2-shop-persistence.test.ts` e correlatos cobrem principalmente o caminho feliz com mocks do `indexedDb`.

**Stores globais com merge raso e sem ações transacionais:**
- Files: `frontend/src/state/gameStore.ts`, `frontend/src/state/settingsStore.ts`, `frontend/src/App.tsx`, `frontend/src/game/engine.ts`
- Why fragile: `setState()` faz merge superficial e notifica listeners de forma síncrona; invariantes entre `status`, `stage`, `bossEncounter`, `activeDrops` e `upgradeLevels` dependem de disciplina manual em vários chamadores.
- Safe modification: trocar para reducer/actions ou encapsular mutações em métodos de domínio com invariantes verificáveis.
- Test coverage: há boa cobertura de regras de gameplay, mas não há testes diretos para invariantes dos stores, ordem de notificações ou edge cases de subscribe/unsubscribe.

**Serviços órfãos aumentam a superfície de manutenção:**
- Files: `frontend/src/services/audioService.ts`, `frontend/src/services/highscoreSyncService.ts`, `frontend/src/services/leaderboardApi.ts`, `frontend/src/game/perf/fpsProbe.ts`
- Why fragile: esses módulos existem, mas não aparecem conectados ao runtime principal atual; podem envelhecer sem regressão visível na suite.
- Safe modification: remover código não usado, colocar atrás de feature flag real ou integrar com cobertura automatizada.
- Test coverage: não há testes detectados para `audioService`, `highscoreSyncService`, `leaderboardApi` ou `useVisibilityPause`.

## Scaling Limits

**Arquitetura suporta apenas uma instância efetiva do jogo por página:**
- Current capacity: uma sessão por documento, compartilhando singletons de engine e stores.
- Limit: múltiplos canvases, embedding paralelo ou testes simultâneos no mesmo contexto tenderão a competir pelo mesmo estado global.
- Scaling path: instanciar engine, input manager e stores por sessão e injetar dependências no bootstrap.

## Build Artifacts

**Artefatos versionados:**
- Issue: não foram detectados artefatos de build versionados no workspace inspecionado.
- Files: `.gitignore`
- Impact: risco atual baixo; `.gitignore` já cobre `/dist`, `/frontend/dist`, `/frontend/playwright-report` e `coverage/`.
- Fix approach: manter essa proteção em CI e revisar mudanças que adicionem saídas geradas fora desses caminhos.

## Missing Critical Features

**Estratégia de recuperação para falhas offline/storage/rede:**
- Problem: o produto persiste dados locais e declara integração remota opcional, mas o runtime não expõe retry, estado degradado, aviso ao usuário ou fila de sincronização quando persistência e rede falham.
- Blocks: operação confiável em browsers com restrições de storage e futura ativação do leaderboard remoto.

## Test Coverage Gaps

**Bootstrap, falhas de browser APIs e fronteiras de integração:**
- What's not tested: inicialização real de `frontend/src/App.tsx`, hidratação do highscore local, rejeições de `indexedDb`, comportamento de `frontend/src/hooks/useVisibilityPause.ts`, chamadas de rede em `frontend/src/services/leaderboardApi.ts` e integração de `frontend/src/services/highscoreSyncService.ts`.
- Files: `frontend/src/App.tsx`, `frontend/src/hooks/useVisibilityPause.ts`, `frontend/src/services/highscoreService.ts`, `frontend/src/services/leaderboardApi.ts`, `frontend/src/services/highscoreSyncService.ts`, `frontend/src/lib/indexedDb.ts`
- Risk: regressões em startup, persistência e integrações externas podem escapar porque a suite está mais forte em regras de gameplay do que em fronteiras operacionais.
- Priority: High

---

*Concerns audit: 2026-03-09*
