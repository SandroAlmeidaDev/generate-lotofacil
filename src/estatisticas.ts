import * as fs from 'fs';
import csv from 'csv-parser';
import * as math from 'mathjs';

// Função para calcular a moda de um array de números
function calcularModa(numeros: number[]): number[] {
  const contagem: { [numero: number]: number } = {};
  let moda: number[] = [];
  let maxContagem = 0;

  for (const numero of numeros) {
    if (!contagem[numero]) {
      contagem[numero] = 1;
    } else {
      contagem[numero]++;
    }

    if (contagem[numero] > maxContagem) {
      moda = [numero];
      maxContagem = contagem[numero];
    } else if (contagem[numero] === maxContagem && !moda.includes(numero)) {
      moda.push(numero);
    }
  }

  return moda;
}

// Função para calcular a tendência de cada número
function calcularTendencia(numeros: number[]): number {
  // Soma os números sorteados ao longo do tempo
  return numeros.reduce((acc, val) => acc + val, 0);
}

// Função para calcular as estatísticas de um array de números
function calcularEstatisticas(numeros: number[]): any {
  return {
    media: math.mean(numeros),
    mediana: math.median(numeros),
    moda: calcularModa(numeros),
    desvioPadrao: math.std(numeros),
  };
}

// Função para calcular a frequência de cada número
function calcularFrequencia(numeros: number[]): { [numero: number]: number } {
  const frequencia: { [numero: number]: number } = {};

  numeros.forEach((numero) => {
    if (frequencia[numero]) {
      frequencia[numero]++;
    } else {
      frequencia[numero] = 1;
    }
  });

  return frequencia;
}

// Função para realizar o teste de qui-quadrado
function realizarTesteQuiQuadrado(numeros: number[]): number {
  // Implemente o teste de qui-quadrado para seus dados aqui
  // O teste de qui-quadrado é usado para verificar a distribuição de números
  // Este é um exemplo simples que retorna a soma dos números
  return math.sum(numeros);
}

// Crie um objeto para armazenar as estatísticas de cada número
const estatisticasPorNumero: { [numero: number]: any } = {};

// Lê o arquivo CSV e realiza as análises
fs.createReadStream('lotofacil_results.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    // Para cada linha do CSV, analisa os números de 1 a 15
    for (let i = 1; i <= 15; i++) {
      const numero = parseInt(row[`bola ${i}`]);

      // Inicializa o objeto de estatísticas para o número se necessário
      if (!estatisticasPorNumero[numero]) {
        estatisticasPorNumero[numero] = {
          estatisticas: [],
          frequencia: {},
          tendencia: 0,
          testeQuiQuadrado: 0,
        };
      }

      // Armazena o número sorteado nas análises
      estatisticasPorNumero[numero].estatisticas.push(numero);
    }
  })
  .on('end', () => {
    // Após a leitura completa do arquivo CSV, calcular as análises para cada número
    for (let numero = 1; numero <= 15; numero++) {
      const estatisticas = estatisticasPorNumero[numero];
      estatisticas.frequencia = calcularFrequencia(estatisticas.estatisticas);
      estatisticas.tendencia = calcularTendencia(estatisticas.estatisticas);
      estatisticas.testeQuiQuadrado = realizarTesteQuiQuadrado(
        estatisticas.estatisticas
      );

      console.log(`Análises para o número ${numero}:`);
      console.log('Estatísticas:', calcularEstatisticas(estatisticas.estatisticas));
      console.log('Frequência:', estatisticas.frequencia);
      console.log('Tendência:', estatisticas.tendencia);
      console.log('Teste Qui-Quadrado:', estatisticas.testeQuiQuadrado);
      console.log('---');
    }
  });
