import * as fs from 'node:fs';
import crypto from 'node:crypto'
import csvParser from 'csv-parser';
import readline from 'readline';
import ExcelJS from 'exceljs';

interface Combination {
  bolas: number[];
}

interface CsvRow {
  'Concurso;Data;bola 1;bola 2;bola 3;bola 4;bola 5;bola 6;bola 7;bola 8;bola 9;bola 10;bola 11;bola 12;bola 13;bola 14;bola 15': string;
}

function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

function getRandomParOrImpar(): number {
  return Math.random() < 0.5 ? getRandomEven() : getRandomOdd();
}

function getRandomEven(): number {
  return 2 * Math.floor(Math.random() * 13) + 2;
}

function getRandomOdd(): number {
  return 2 * Math.floor(Math.random() * 12) + 1;
}

function getRandomContourNumber(): number {
  const contourNumbers = [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 25];
  return contourNumbers[Math.floor(Math.random() * contourNumbers.length)];
}

function getRandomCenterNumber(): number {
  const centerNumbers = [7, 8, 9, 12, 13, 14, 17, 18, 19];
  return centerNumbers[Math.floor(Math.random() * centerNumbers.length)];
}

function generateRandomCombinations(fixedNumbers: number[], length: number, numGames: number): number[][] {
  const combinations: number[][] = [];

  for (let i = 0; i < numGames; i++) {
    const randomCombination: number[] = [...fixedNumbers];

    while (randomCombination.length < length) {
      let randomNumber: number;

      if (Math.random() < 0.5) {
        randomNumber = getRandomParOrImpar();
      } else {
        do {
          randomNumber = Math.floor(Math.random() * 25) + 1;
        } while (!isPrime(randomNumber));
      }

      if (Math.random() < 0.5) {
        randomNumber = getRandomContourNumber();
      } else {
        randomNumber = getRandomCenterNumber();
      }

      if (!randomCombination.includes(randomNumber)) {
        randomCombination.push(randomNumber);
      }
    }

    combinations.push(randomCombination);
  }

  return combinations;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Informe a combinação de números fixos separados por vírgula: ', (fixedNumbersInput) => {
  const fixedNumbers = fixedNumbersInput.split(',').map(num => parseInt(num, 10));

  rl.question('Informe a quantidade de jogos que deseja gerar: ', (numGamesInput) => {
    const numGames = parseInt(numGamesInput, 10);

    rl.question('Informe a quantidade de dezendas que de cada jogo: ', (numTensInput) => {
      const numTens = parseInt(numTensInput, 10);

      const filePath = './resultados_lotofacil.csv';

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Combinations');

      const existingCombinations: Combination[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: CsvRow) => {
          const numbers = extractNumbers(row);
          const combination: Combination = {
            bolas: numbers,
          };
          existingCombinations.push(combination);
        })
        .on('end', () => {

          switch (numTens) {
            case 15: 
              worksheet.addRow(['Jogo', 'Bola 1', 'Bola 2', 'Bola 3', 'Bola 4', 'Bola 5', 'Bola 6', 'Bola 7', 'Bola 8', 'Bola 9', 'Bola 10', 'Bola 11', 'Bola 12', 'Bola 13', 'Bola 14', 'Bola 15', 'Total Par', 'Total Ímpar', 'Primos', 'Contorno', 'Centro', 'SomaTotal']);
            break;
            case 16:
              worksheet.addRow(['Jogo', 'Bola 1', 'Bola 2', 'Bola 3', 'Bola 4', 'Bola 5', 'Bola 6', 'Bola 7', 'Bola 8', 'Bola 9', 'Bola 10', 'Bola 11', 'Bola 12', 'Bola 13', 'Bola 14', 'Bola 15', 'Bola 16', 'Total Par', 'Total Ímpar', 'Primos', 'Contorno', 'Centro', 'SomaTotal']);
            break;
            case 17:
              worksheet.addRow(['Jogo', 'Bola 1', 'Bola 2', 'Bola 3', 'Bola 4', 'Bola 5', 'Bola 6', 'Bola 7', 'Bola 8', 'Bola 9', 'Bola 10', 'Bola 11', 'Bola 12', 'Bola 13', 'Bola 14', 'Bola 15', 'Bola 16', 'Bola 17', 'Total Par', 'Total Ímpar', 'Primos', 'Contorno', 'Centro', 'SomaTotal']);
            break;
            case 18:
              worksheet.addRow(['Jogo', 'Bola 1', 'Bola 2', 'Bola 3', 'Bola 4', 'Bola 5', 'Bola 6', 'Bola 7', 'Bola 8', 'Bola 9', 'Bola 10', 'Bola 11', 'Bola 12', 'Bola 13', 'Bola 14', 'Bola 15', 'Bola 16', 'Bola 17', 'Bola 18', 'Total Par', 'Total Ímpar', 'Primos', 'Contorno', 'Centro', 'SomaTotal']);
            break;
            case 19:
              worksheet.addRow(['Jogo', 'Bola 1', 'Bola 2', 'Bola 3', 'Bola 4', 'Bola 5', 'Bola 6', 'Bola 7', 'Bola 8', 'Bola 9', 'Bola 10', 'Bola 11', 'Bola 12', 'Bola 13', 'Bola 14', 'Bola 15', 'Bola 16', 'Bola 17', 'Bola 18', 'Bola 19', 'Total Par', 'Total Ímpar', 'Primos', 'Contorno', 'Centro', 'SomaTotal']);
            break;
            case 20:
              worksheet.addRow(['Jogo', 'Bola 1', 'Bola 2', 'Bola 3', 'Bola 4', 'Bola 5', 'Bola 6', 'Bola 7', 'Bola 8', 'Bola 9', 'Bola 10', 'Bola 11', 'Bola 12', 'Bola 13', 'Bola 14', 'Bola 15', 'Bola 16', 'Bola 17', 'Bola 18', 'Bola 19', 'Bola 20', 'Total Par', 'Total Ímpar', 'Primos', 'Contorno', 'Centro', 'SomaTotal']);
            break;
          }          

          for (let i = 0; i < numGames; i++) {
            const generatedCombination = generateRandomCombinations(fixedNumbers, numTens, 1)[0];
            const sortedGeneratedCombination = generatedCombination.slice().sort((a, b) => a - b);

            generatedCombination.sort((a, b) => a - b);

            const exists = existingCombinations.some((existingCombination) => {
              const sortedExistingCombination = existingCombination.bolas.slice().sort((a, b) => a - b);
              return JSON.stringify(sortedGeneratedCombination) === JSON.stringify(sortedExistingCombination);
            });

            if (exists) {
              console.log(`Combinação ${i + 1}: ${generatedCombination.join(', ')} (Já existe)\n`);
            } else {
              const totalPar = generatedCombination.filter(num => num % 2 === 0).length;
              const totalImpar = generatedCombination.filter(num => num % 2 !== 0).length;
              const totalPrimos = generatedCombination.filter(num => isPrime(num)).length;
              const totalContorno = generatedCombination.filter(num => [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 25].includes(num)).length;
              const totalCentro = generatedCombination.filter(num => [7, 8, 9, 12, 13, 14, 17, 18, 19].includes(num)).length;
              const totalSoma = generatedCombination.reduce((acc, num) => acc + num, 0);

              const row = [`${i + 1}`, ...generatedCombination, totalPar, totalImpar, totalPrimos, totalContorno, totalCentro, totalSoma];
              worksheet.addRow(row);
            }
          }

          const folderName = 'src/generated_combinations';

          if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
          }

          const randomOutputFile = crypto.randomUUID()

          const outputFile = `./${folderName}/${randomOutputFile}.xlsx`

          workbook.xlsx.writeFile(outputFile)
            .then(() => {
              console.log(`Jogos gerados foram salvos em ${outputFile}`);
              rl.close();
            })
            .catch((error) => {
              console.error('Erro ao salvar o arquivo XLSX:', error);
              rl.close();
            });
          rl.close();
        });
    });
  });
});

function extractNumbers(row: CsvRow): number[] {
  const rowData = row['Concurso;Data;bola 1;bola 2;bola 3;bola 4;bola 5;bola 6;bola 7;bola 8;bola 9;bola 10;bola 11;bola 12;bola 13;bola 14;bola 15'];
  const numbersAsString = rowData.split(';').slice(2);
  const numbers = numbersAsString.map(number => parseInt(number, 10));
  return numbers;
}
