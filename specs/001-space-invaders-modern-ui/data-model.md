# data-model.md

Entities:

- Player:
  - id: string (session)
  - lives: integer >= 0
  - score: integer >= 0
  - position: { x: number, y: number }
  - powerUps: list of PowerUp instances (active)

- Enemy:
  - id: string
  - type: string (e.g., basic, shooter, boss)
  - position: { x: number, y: number }
  - health: integer >= 0
  - pattern: enum / descriptor
  - points: integer

- Projectile:
  - id: string
  - origin: 'player' | 'enemy'
  - position: { x:number, y:number }
  - velocity: { x:number, y:number }
  - damage: integer > 0

- PowerUp:
  - id: string
  - type: enum (double-shot, shield, speed)
  - durationSeconds: number

- Stage:
  - id: integer
  - enemyPatterns: list
  - winCondition: e.g., all enemies defeated

- ShopItem:
  - id: string
  - name: string
  - costPoints: integer
  - effect: descriptor

- HighScore:
  - playerName: string optional
  - score: integer
  - timestamp: ISO string

Validation rules: numeric ranges, non-null IDs, durations positive, positions finite numbers.

State transitions: powerUps: inactive -> active (on collect) -> expired (after duration).
