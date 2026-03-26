---
status: complete
phase: 01-campaign-meta-layer
source:
  - .planning/phases/01-campaign-meta-layer/01-01-SUMMARY.md
  - .planning/phases/01-campaign-meta-layer/01-02-SUMMARY.md
started: 2026-03-24T15:37:50.3254041-03:00
updated: 2026-03-24T15:46:00.6380436-03:00
---

## Current Test

[testing complete]

## Tests

### 1. Mapa de campanha exibe progresso por fase
expected: Ao abrir a tela de campanha, fases concluídas aparecem como completas, a próxima fase jogável aparece desbloqueada e as demais permanecem bloqueadas.
result: pass

### 2. Fase bloqueada mostra dica de desbloqueio
expected: Ao tentar interagir com fase bloqueada, o jogador vê a dica "Derrote o chefe da fase anterior para desbloquear" e não consegue iniciar essa fase.
result: pass

### 3. Selecao de fase desbloqueada inicia run correta
expected: Ao selecionar uma fase desbloqueada, a run inicia nessa fase e o HUD/contexto de progresso reflete a fase selecionada.
result: pass

### 4. Run interrompida aparece com opcoes de continuidade
expected: Depois de interromper uma run e retornar, aparece o prompt "Run interrompida encontrada" com as acoes "Continuar" e "Reiniciar".
result: pass

### 5. Acao Continuar retoma run interrompida
expected: Ao escolher "Continuar" no prompt de run interrompida, a sessao retoma do estado salvo sem perder o progresso esperado.
result: pass

### 6. Acao Reiniciar reinicia com confirmacao
expected: Ao escolher "Reiniciar", o fluxo pede confirmacao e inicia nova tentativa da fase alvo, descartando o estado interrompido anterior.
result: pass

### 7. Conclusao de fase mostra overlay e progressao
expected: Ao derrotar o chefe, aparece "FASE COMPLETADA" com CTA "Proxima fase"; ao seguir, a proxima fase fica desbloqueada no mapa.
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

