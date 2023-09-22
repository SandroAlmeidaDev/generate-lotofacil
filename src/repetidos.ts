import * as fs from 'fs';
import * as readline from 'readline';

// Variável global para armazenar os números anteriores
let numerosAnteriores: number[] = [];

// Função para analisar os números repetidos nos concursos
function analisarNumerosRepetidos(concursos: string[]) {
  const numerosRepetidos: { [key: string]: number[] } = {};
  let totalNumerosRepetidos = 0;

  for (let i = 0; i < concursos.length; i++) {
    const numerosConcurso = concursos[i].split(';').slice(2).map(Number);

    // Encontrar números repetidos com o concurso anterior
    if (i > 0) {
      const numerosRepetidosConcursoAnterior = numerosConcurso.filter((numero) =>
        numerosAnteriores.includes(numero)
      );
      numerosRepetidos[i] = numerosRepetidosConcursoAnterior;
      totalNumerosRepetidos += numerosRepetidosConcursoAnterior.length;
    }

    numerosAnteriores = numerosConcurso;
  }

  const mediaNumerosRepetidos = totalNumerosRepetidos / (concursos.length - 1);
  console.log(`Média de números que se repetem: ${mediaNumerosRepetidos.toFixed(2)}`);
  return mediaNumerosRepetidos;
}

// Função para gerar combinações para o próximo concurso
// Função para gerar combinações para o próximo concurso
// Função para gerar combinações para o próximo concurso
function gerarCombinacoes(concursoAtual: number, mediaNumerosRepetidos: number, numJogos: number, numDezenas: number) {
  console.log(`Gerando ${numJogos} jogos com ${numDezenas} dezenas para o concurso ${concursoAtual}...`);

  const numerosPossiveis = Array.from({ length: 25 }, (_, i) => i + 1);
  const jogosGerados: number[][] = [];

  for (let j = 0; j < numJogos; j++) {
    const jogo: number[] = [];
    let numerosRepetidosNoJogo = 0;

    while (jogo.length < numDezenas) {
      const numeroAleatorio = Math.floor(Math.random() * 25) + 1;

      if (!jogo.includes(numeroAleatorio)) {
        if (numerosRepetidosNoJogo < mediaNumerosRepetidos) {
          // Adicione qualquer número, já que ainda não atingimos a média de números repetidos
          jogo.push(numeroAleatorio);
        } else {
          // Verifique se o número aleatório está entre os números repetidos anteriormente
          const repetidosNoJogo = jogo.filter((numero) => numerosAnteriores.includes(numero));
          const numerosPossiveisFiltrados = numerosPossiveis.filter(
            (numero) => !jogo.includes(numero) && numerosAnteriores.includes(numero)
          );

          if (repetidosNoJogo.length >= mediaNumerosRepetidos && numerosPossiveisFiltrados.length > 0) {
            // Adicione o número aleatório se já tivermos a média ou mais números repetidos
            jogo.push(numerosPossiveisFiltrados[0]);
          } else {
            // Adicione qualquer número disponível se não atingirmos a média de números repetidos
            jogo.push(numeroAleatorio);
          }
        }
      }

      if (numerosAnteriores.includes(numeroAleatorio)) {
        numerosRepetidosNoJogo++;
      }
    }

    jogo.sort((a, b) => a - b);
    jogosGerados.push(jogo);
  }

  return jogosGerados;
}



// Função principal para processar o arquivo CSV e gerar combinações
async function processarArquivoCSV() {
  const arquivoStream = fs.createReadStream('./lotofacil_results.csv', 'utf8');
  const rl = readline.createInterface({
    input: arquivoStream,
    crlfDelay: Infinity,
  });

  const linhas: string[] = [];

  for await (const linha of rl) {
    linhas.push(linha.trim());
  }

  const mediaNumerosRepetidos = analisarNumerosRepetidos(linhas);

  // Solicitar ao usuário o número de jogos e dezenas desejados
  const numJogos = await obterEntradaUsuario('Quantos jogos você deseja gerar? ');
  const numDezenas = await obterEntradaUsuario('Quantas dezenas por jogo? ');

  const concursoAtual = linhas.length;
  const jogosGerados = gerarCombinacoes(concursoAtual, mediaNumerosRepetidos, numJogos, numDezenas);

  console.log(`Jogos gerados para o concurso ${concursoAtual}:`);
  jogosGerados.forEach((jogo, index) => {
    console.log(`Jogo ${index + 1}: ${jogo.join(', ')}`);
  });
}

// Função para coletar uma entrada do usuário
function obterEntradaUsuario(pergunta: string): Promise<number> {
  return new Promise<number>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(pergunta, (resposta) => {
      rl.close(); // Fechar a interface readline
      resolve(parseInt(resposta, 10));
    });
  });
}

// Chamar a função principal para iniciar o processo
processarArquivoCSV();
