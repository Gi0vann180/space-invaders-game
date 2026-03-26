# Phase 1: Campaign Meta-Layer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 01-Campaign Meta-Layer
**Areas discussed:** Estrutura da campanha, Regras de progresso, Persistencia e autosave, Retomada offline

---

## Estrutura da campanha

### Pergunta 1: Como o mapa de fases deve ser estruturado no v1?

| Option | Description | Selected |
|--------|-------------|----------|
| Linear 1-5 | Fluxo direto fase 1→5 com desbloqueio sequencial | ✓ |
| Nodos com bifurcacao | Mapa com caminhos alternativos | |
| Hub com selecao livre | Todas as fases visiveis e escolhidas manualmente | |
| You decide | Deixo o agente escolher pelo melhor custo/beneficio | |

### Pergunta 2: Como representar visualmente a progressao no mapa?

| Option | Description | Selected |
|--------|-------------|----------|
| Nos conectados por trilha | Cada fase e um no com estado visual | ✓ |
| Lista vertical | Cards de fase em lista simples | |
| Grid 2D | Mapa em grade com posicoes fixas | |
| You decide | Deixo o agente escolher | |

### Pergunta 3: Como mostrar fases bloqueadas no v1?

| Option | Description | Selected |
|--------|-------------|----------|
| Visiveis com cadeado | Mostra todas com requisito de unlock | ✓ |
| Ocultas ate destravar | So aparece quando liberar | |
| Visiveis sem detalhe | Mostra numero sem requisito | |
| You decide | Deixo o agente escolher | |

### Pergunta 4: Re-jogar fase antiga deve funcionar como?

| Option | Description | Selected |
|--------|-------------|----------|
| Permitido sem perder progresso | Farm/treino mantendo campanha | ✓ |
| Bloqueado | So fase atual | |
| Permitido com custo | Gasta recurso para replay | |
| You decide | Deixo o agente escolher | |

**User's choice summary:** Linear 1-5, nodes conectados, locked visivel com cadeado, replay permitido sem perda.

---

## Regras de progresso

### Pergunta 1: Qual condicao define fase completada no v1?

| Option | Description | Selected |
|--------|-------------|----------|
| Derrotar o boss da fase | Condicao principal de conclusao | ✓ |
| Sobreviver por tempo-alvo | Sem boss obrigatorio | |
| Objetivos mistos | Boss + objetivo secundario | |
| You decide | Deixo o agente escolher | |

### Pergunta 2: Que recompensa minima exibir ao concluir fase?

| Option | Description | Selected |
|--------|-------------|----------|
| Pacote fixo + escolha de bonus | Moeda/score + 1 bonus | ✓ |
| Apenas score | Sem recompensa extra | |
| Loot aleatorio | Recompensa totalmente RNG | |
| You decide | Deixo o agente escolher | |

### Pergunta 3: Como destravar a proxima fase?

| Option | Description | Selected |
|--------|-------------|----------|
| Automatico apos boss | Libera imediatamente ao concluir | ✓ |
| Precisa nota minima | Exige score/ranking minimo | |
| Precisa recurso de unlock | Gasta moeda para abrir | |
| You decide | Deixo o agente escolher | |

### Pergunta 4: Ao perder uma fase, qual comportamento no v1?

| Option | Description | Selected |
|--------|-------------|----------|
| Retry imediato na mesma fase | Retorno rapido para nova tentativa | ✓ |
| Retorna ao menu campanha | Seleciona fase novamente | |
| Perde desbloqueio recente | Retrocede progresso | |
| You decide | Deixo o agente escolher | |

**User's choice summary:** Conclusao por boss, reward fixo + bonus, unlock automatico, retry imediato.

---

## Persistencia e autosave

### Pergunta 1: Em quais momentos salvar progresso?

| Option | Description | Selected |
|--------|-------------|----------|
| Ao concluir fase | checkpoint principal | ✓ |
| Ao abrir fase | inicio de tentativa | ✓ |
| Ao pausar/background | protege interrupcao mobile | ✓ |
| A cada X segundos | autosave por timer | |

### Pergunta 2: Estrategia de escrita no storage no v1?

| Option | Description | Selected |
|--------|-------------|----------|
| Por evento (checkpoint) | grava em marcos | ✓ |
| Timer fixo | grava periodicamente | |
| Hibrido | checkpoint + timer | |
| You decide | Deixo o agente escolher | |

### Pergunta 3: O que deve persistir para campanha?

| Option | Description | Selected |
|--------|-------------|----------|
| Maior fase desbloqueada | base de progressao | ✓ |
| Resultado da fase atual | ultimo estado minimo | ✓ |
| Total de runs | progresso agregado | ✓ |
| Snapshot completo da run | estado total de runtime | |

### Pergunta 4: Dados antigos/incompativeis no storage?

| Option | Description | Selected |
|--------|-------------|----------|
| Migrar quando possivel + fallback seguro | preservar minimo com seguranca | ✓ |
| Reset total | limpa tudo | |
| Bloquear jogo ate corrigir | exige acao manual | |
| You decide | Deixo o agente escolher | |

**User's choice summary:** Save por eventos de checkpoint, persistencia minima de campanha, migracao com fallback seguro.

---

## Retomada offline

### Pergunta 1: Ao reabrir app com run interrompida, qual UX?

| Option | Description | Selected |
|--------|-------------|----------|
| Prompt Continuar ou Reiniciar | escolha explicita do usuario | ✓ |
| Retoma automatico | entra direto na run | |
| Sempre reinicia fase | ignora estado salvo | |
| You decide | Deixo o agente escolher | |

### Pergunta 2: Run interrompida expira apos quanto tempo?

| Option | Description | Selected |
|--------|-------------|----------|
| Sem expiracao no v1 | continua se estado valido | ✓ |
| 24 horas | expira em um dia | |
| Mesma sessao apenas | invalida ao fechar | |
| You decide | Deixo o agente escolher | |

### Pergunta 3: Snapshot corrompido/invalido, qual fallback?

| Option | Description | Selected |
|--------|-------------|----------|
| Voltar inicio da fase atual | preserva campanha e evita bloqueio | ✓ |
| Voltar para fase 1 | reset forte | |
| Mostrar erro e bloquear | exige intervencao | |
| You decide | Deixo o agente escolher | |

### Pergunta 4: Sem internet, comportamento correto no v1?

| Option | Description | Selected |
|--------|-------------|----------|
| Funciona total local | campanha e retomada 100% locais | ✓ |
| Funciona parcial | alguns fluxos pedem rede | |
| Bloqueia progressao | exige internet para validar | |
| You decide | Deixo o agente escolher | |

**User's choice summary:** Prompt continuar/reiniciar, sem expiracao, fallback para inicio da fase atual, funcionamento total offline.

---

## the agent's Discretion

- Estilo visual exato do mapa e microinteracoes de transicao.
- Forma exata do payload de persistencia, respeitando as decisoes de checkpoint.

## Deferred Ideas

None.
