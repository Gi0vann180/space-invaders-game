# research.md

Decision: Use React + TypeScript with a Canvas-based renderer managed outside React for the game loop.

Rationale: Keeps React responsible for UI overlays and menus while allowing a deterministic, high-performance game loop using requestAnimationFrame and canvas for rendering. TypeScript provides type-safety for complex game logic.

Alternatives considered:
- Use WebGL or a game engine (e.g., Phaser): more power but larger dependency and complexity; rejected for MVP to keep bundle small.
- Pure DOM-based rendering: simpler but poor performance for many moving objects.

Additional decisions:
- State management: prefer `useReducer` or a lightweight predictable container (Zustand) for game/session state; game logic should be testable with injected time deltas.
- Audio: use Web Audio API (or Howler.js as a small wrapper) for effects and music with toggles in settings.
- Persistence: local highscore via localStorage (sync to remote leaderboard is optional, via a simple API contract).
- Testing: Vitest + React Testing Library for unit/component tests; Playwright for E2E smoke flows.


Summary of choices:
- Renderer: Canvas (2D) managed by an isolated renderer.
- Language: TypeScript.
- Styling/UI: Tailwind CSS for rapid, consistent styling.
- Build/tooling: Vite for dev/build.



