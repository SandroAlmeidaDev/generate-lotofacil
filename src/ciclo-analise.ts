import fs from 'node:fs';
import readline from 'node:readline';

interface Concurso {
  numero: number;
  data: string;
  numeros: number[];
}

interface Ciclo {
  inicio: number;
  fim: number;
  numerosFaltando: number[];
}

export function analisarCiclos(filePath: string, numerosParaAnalise: number[], concursoInicial: number): void {
  const matrixSize = Math.sqrt(numerosParaAnalise.length);
  const totalNumbers = numerosParaAnalise.length;

  const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  const ciclos: Ciclo[] = [];
  let currentCiclo: Ciclo | null = null;
  let currentConcurso: Concurso | null = null;

  function analisarConcurso(concurso: Concurso) {
    if (!currentCiclo) {
      currentCiclo = { inicio: concurso.numero, fim: concurso.numero, numerosFaltando: [...numerosParaAnalise] };
    }

    const numerosSorteados = concurso.numeros;

    for (const numeroSorteado of numerosSorteados) {
      const index = currentCiclo.numerosFaltando.indexOf(numeroSorteado);
      if (index !== -1) {
        currentCiclo.numerosFaltando.splice(index, 1);
      }
    }

    if (currentCiclo.numerosFaltando.length === 0) {
      currentCiclo.fim = concurso.numero;
      const ciclosNecessarios = Math.ceil((concurso.numero - currentCiclo.inicio + 1) / totalNumbers);
      console.log(`Ciclo ${currentCiclo.inicio}-${currentCiclo.fim} fechado em ${ciclosNecessarios} concursos.`);
      ciclos.push(currentCiclo);
      currentCiclo = null;
    }

    console.log(numerosSorteados);
  }

  rl.on('line', (line) => {
    if (!currentConcurso) {
      // Ignorar a linha de cabeçalho
      currentConcurso = null;
    } else {
      const [numero, data, ...numeros] = line.split(';').map((str) => str.trim());
      const concurso: Concurso = {
        numero: parseInt(numero, 10),
        data,
        numeros: numeros.map((num) => parseInt(num, 10)),
      };
      if (concurso.numero >= concursoInicial) {
        analisarConcurso(concurso);
      }
    }
  });

  rl.on('close', () => {
    if (currentCiclo) {
      console.log(`Ciclo ${currentCiclo.inicio}-${currentCiclo.fim} não foi fechado.`);
    }

  });
}
