import fs from 'fs';
import csvParser from 'csv-parser';

export interface Game {
  concourse: number;
  numbers: number[]
}


interface CsvRow {
  'Concurso;Data;bola 1;bola 2;bola 3;bola 4;bola 5;bola 6;bola 7;bola 8;bola 9;bola 10;bola 11;bola 12;bola 13;bola 14;bola 15': string;
}

export function readCSV(filePath: string): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    const results: Game[] = [];

    fs.createReadStream(filePath, { encoding: 'utf-8' })
      .pipe(csvParser())
      .on('data', (line: CsvRow) => {
        const rowData = line['Concurso;Data;bola 1;bola 2;bola 3;bola 4;bola 5;bola 6;bola 7;bola 8;bola 9;bola 10;bola 11;bola 12;bola 13;bola 14;bola 15'];

        if (rowData) {
          const rows = rowData.split(';')
          const concourse = parseInt(rows[0], 10);
          const numbers = rows.slice(2).map(item => parseInt(item, 10));
          const game = {
            concourse: concourse,
            numbers: numbers
          }          
          results.push(game)
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

