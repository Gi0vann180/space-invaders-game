# Quick Task Summary

Removed the run modifier offer from the shop UI and game flow, then deleted the leftover run modifier system and its dedicated unit test.

## Changed
- Removed run offer state from the game session model and store.
- Stopped generating run modifier offers in the shop transition.
- Removed run offer rendering and selection callbacks from the shop screen and App.
- Deleted the now-unused run modifier system module and its unit coverage.
- Updated shop UI tests and E2E coverage to assert the offer is absent.

## Verification
- TypeScript errors: none found in `frontend/src` and `frontend/tests`.
