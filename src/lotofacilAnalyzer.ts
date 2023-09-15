interface CycleInfo {
  cycleNumber: number;
  gamesToClose: number;
  missingNumbers: number[];
}

export function analyzeCycles(games: any[], sequence: number[]): CycleInfo[] {
  let currentCycle = 1;
  let missingNumbers: number[] = [...sequence];
  let requiredGames = 0;
  let cycleGames: CycleInfo[] = []; // Array para armazenar informações de cada ciclo

  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    // Remove os números da sequência atual do array de números faltantes
    for (const num of game.numbers) {
      const index = missingNumbers.indexOf(num);
      if (index !== -1) {
        missingNumbers.splice(index, 1);
      }
    }

    // Se todos os números da sequência foram sorteados
    if (missingNumbers.length === 0) {
      cycleGames.push({
        cycleNumber: currentCycle,
        gamesToClose: requiredGames + 1,
        missingNumbers: [...sequence],
      });

      currentCycle++;
      requiredGames = 0;
      missingNumbers = [...sequence];
    } else {
      requiredGames++;
    }
  }

  if (requiredGames > 0) {
    cycleGames.push({
      cycleNumber: currentCycle,
      gamesToClose: requiredGames,
      missingNumbers: [...missingNumbers],
    });
  }

  return cycleGames;
}
