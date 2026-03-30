# M001: M001: Migration

## Vision
Um jogo arcade shooter inspirado em Space Invaders, com loop de campanha por fases, chefes e progressao de build durante a partida.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Campaign Meta Layer | medium | — | ✅ | Implement campaign persistence foundation and resume-safe runtime contracts for Phase 01. |
| S02 | Boss Encounters | medium | S01 | ⬜ | Implementar o contrato base de encounters de boss da fase 2: boss por fase de campanha, identidade mecanica por perfil e ciclo de estado explicito para tentativa/resultado. |
| S03 | Build System & Synergies | medium | S02 | ⬜ | unit tests prove Build System & Synergies works |
| S04 | Dynamic Events | medium | S03 | ⬜ | unit tests prove Dynamic Events works |
| S05 | Mobile Touch & UX Polish | medium | S04 | ⬜ | unit tests prove Mobile Touch & UX Polish works |
| S06 | Monetization & Soft Launch | medium | S05 | ⬜ | unit tests prove Monetization & Soft Launch works |
| S07 | App Store Distribution | medium | S06 | ⬜ | unit tests prove App Store Distribution works |
