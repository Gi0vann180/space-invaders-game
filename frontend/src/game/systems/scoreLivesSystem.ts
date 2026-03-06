type ScoreLivesUpdateInput = {
  score: number
  lives: number
  defeatedEnemyCount: number
  enemyReachedBottom: boolean
  playerHitCount: number
  bonusScore?: number
}

type ScoreLivesUpdateOutput = {
  score: number
  lives: number
  isGameOver: boolean
}

export function updateScoreAndLives({
  score,
  lives,
  defeatedEnemyCount,
  enemyReachedBottom,
  playerHitCount,
  bonusScore = 0
}: ScoreLivesUpdateInput): ScoreLivesUpdateOutput {
  const nextScore = score + defeatedEnemyCount * 10 + bonusScore
  const totalDamage = playerHitCount + (enemyReachedBottom ? 1 : 0)
  const nextLives = Math.max(0, lives - totalDamage)

  return {
    score: nextScore,
    lives: nextLives,
    isGameOver: nextLives === 0
  }
}
