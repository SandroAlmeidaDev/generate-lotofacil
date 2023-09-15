import { readCSV } from './csvReader'; // Substitua pelo caminho correto para seu arquivo csvReader
import * as readline from 'readline';

function getUserInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function analyzeCycles(games: any[], sequence: number[]): void {
  let currentCycle = 1;
  let missingNumbers: number[] = [...sequence];
  let requiredGames = 0;
  let cycleGames: number[] = []; // Array para armazenar a quantidade de concursos para fechar cada ciclo

  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    // Remove os números da sequência atual do array de números faltantes
    for (const num of game.numbers) {
      const index = missingNumbers.indexOf(num);
      if (index !== -1) {
        missingNumbers.splice(index, 1);
      }
    }

    console.log(`Concurso ${game.concourse}: Números Faltantes - ${missingNumbers.join(', ')}`);

    // Se todos os números da sequência foram sorteados
    if (missingNumbers.length === 0) {
      console.log(`Ciclo ${currentCycle} fechado após ${requiredGames + 1} concursos.`);
      cycleGames.push(requiredGames + 1); // Adiciona a quantidade de concursos ao array
      currentCycle++;
      requiredGames = 0;
      missingNumbers = [...sequence];
    } else {
      requiredGames++;
    }
  }

  if (requiredGames > 0) {
    console.log(`Ciclo ${currentCycle} não foi fechado após ${requiredGames} concursos.`);
  }

  // Encontra o maior valor no array de quantidade de concursos para fechar cada ciclo
  const largestCycle = Math.max(...cycleGames);

  console.log(`Maior quantidade de concursos para fechar um ciclo: ${largestCycle}`);
  if (cycleGames.length > 0) {
    const averageGamesToClose = cycleGames.reduce((a, b) => a + b, 0) / cycleGames.length;
    console.log(`Média de concursos para fechar o ciclo: ${averageGamesToClose}`);
  } else {
    console.log('Nenhum ciclo foi fechado.');
  }

  // Calcular a probabilidade de acertar a sequência no próximo sorteio
  const totalCycles = cycleGames.length;
  const probabilities: { number: number; probability: number }[] = [];

  for (const num of sequence) {
    const frequency = cycleGames.filter((cycles) => cycles >= num).length;
    const probability = frequency / totalCycles;
    probabilities.push({ number: num, probability: probability });
  }

  // Ordenar os números por probabilidade
  probabilities.sort((a, b) => b.probability - a.probability);

  console.log('Probabilidades de acertar a sequência no próximo sorteio:');
  const topProbabilities = probabilities.filter(({ probability }) => probability > 0);
  for (const { number, probability } of topProbabilities) {
    const roundedProbability = Math.ceil(probability * 100 * 100) / 100; // Arredonda para cima e formata com 2 casas decimais
    console.log(`Número ${number}: ${roundedProbability.toFixed(2)}%`);
  }
}

async function main() {
  try {
    const games = await readCSV('./lotofacil_results.csv'); 
    const sequenceStr = await getUserInput('Digite a sequência de números a ser analisada (separados por vírgula): ');
    const sequence = sequenceStr.split(',').map((numStr) => parseInt(numStr.trim(), 10));

    analyzeCycles(games, sequence);
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
