# quickstart.md

## Executar localmente

1. Instalar dependências do frontend:

```bash
cd frontend
npm install
```

2. Rodar em desenvolvimento:

```bash
npm run dev
```

3. Abrir no navegador:

- `http://localhost:5173`

## Validar qualidade

```bash
npm run typecheck
npm run lint
npm run test
```

## Smoke E2E

```bash
npx playwright install chromium
npx playwright test tests/e2e/us1-round.spec.ts tests/e2e/us3-inputs-a11y.spec.ts
```

## Fluxos principais para validar manualmente

- US1: iniciar rodada, eliminar inimigos, perder vidas, game over e reiniciar.
- US2: concluir fase, comprar upgrade na loja, iniciar próxima fase com upgrade aplicado.
- US3: abrir configurações, alternar alto contraste/legendas/consentimento e confirmar persistência.
