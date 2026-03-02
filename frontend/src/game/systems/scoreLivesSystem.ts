type ScoreLivesUpdateInput = {
  score: number
  lives: number
  defeatedEnemyCount: number
  enemyReachedBottom: boolean
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
  enemyReachedBottom
}: ScoreLivesUpdateInput): ScoreLivesUpdateOutput {
  const nextScore = score + defeatedEnemyCount * 10
  const nextLives = enemyReachedBottom ? Math.max(0, lives - 1) : lives

  return {
    score: nextScore,
    lives: nextLives,
    isGameOver: nextLives === 0
  }
}
