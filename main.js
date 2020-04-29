const produtos = require('./dados');
const util = require('./util');

const CAPACIDADE_MOCHILA = 53;
const TAMANHO_POPULACAO  = 1000;
const NUMERO_DE_GERACOES = 100;
const NUMERO_REPETE      = 200;
const NUMERO_COMBINA     = 600;
const NUMERO_ALEATORIO   = 200;

const geneAleatorio = () => {
  let gene = [];

  // monta a mochila colocando quantidades aleatórias de cada produto
  produtos.forEach(produto => {
    gene.push(util.range(0, produto.quantidade + 1));
  });

  return gene;
};

const combina = (geneA, geneB) => {
  let novoGene = [];

  for (let i = 0; i < geneA.length; i++) {
    let caracteristica = null;
    // determina se vai herdar a característica do gene A ou B
    if (util.range(0, 10) < 5) { // 50% de chance de pegar de cada gene
      caracteristica = geneA[i];
    } else {
      caracteristica = geneB[i];
    }
    novoGene.push(caracteristica);
  }

  return novoGene;
};

// essa é a função que tentaremos maximizar
const valor = (gene) => {
  let pesoTotal = gene.map((qtd, indice) => produtos[indice].peso * qtd).reduce((a, b) => a + b, 0);

  if (pesoTotal > CAPACIDADE_MOCHILA) {
    return 0; // não pode exceder a capacidade total da mochila
  }

  let valorTotal = gene.map((qtd, indice) => qtd * produtos[indice].valor).reduce((a, b) => a + b, 0);
  return valorTotal;
};

const gerarPopulacaoInicial = () => {
  let populacao = [];
  for (let i = 0; i < TAMANHO_POPULACAO; i++) {
    populacao.push(geneAleatorio());
  }
  return populacao;
};

const melhorGene = (populacao) => {
  populacao.sort((geneA, geneB) => valor(geneB) - valor(geneA));
  return {gene: populacao[0], valor: valor(populacao[0])};
};

const proximaGeracao = (populacao) => {
  // ordena a população do maior valor para o menor
  populacao.sort((geneA, geneB) => valor(geneB) - valor(geneA));

  let novaPopulacao = [];

  // os melhores passam para a próxima geração
  for (let i = 0; i < NUMERO_REPETE; i++) {
    novaPopulacao.push(populacao[i]);
  }

  // os melhores são combinados e passam para a próxima geração
  for (let i = 0; i < NUMERO_COMBINA; i++) {
    let a = util.range(0, NUMERO_COMBINA);
    let b = util.range(0, NUMERO_COMBINA);
    novaPopulacao.push(combina(populacao[a], populacao[b]));
  }

  // o restante é gerado aleatoriamente
  for (let i = 0; i < NUMERO_ALEATORIO; i++) {
    novaPopulacao.push(geneAleatorio());
  }

  return novaPopulacao;
};

const processa = () => {
  let populacao = gerarPopulacaoInicial();

  for (let i = 0; i < NUMERO_DE_GERACOES; i++) {
    console.log('geracao', i, 'melhor gene', melhorGene(populacao));
    populacao = proximaGeracao(populacao);
  }

  // Imprime o resultado
  let melhor = melhorGene(populacao);
  let pesoTotal = melhor.gene.map((qtd, indice) => produtos[indice].peso * qtd).reduce((a, b) => a + b, 0);
  for (let i = 0; i < melhor.gene.length; i++) {
    console.log(melhor.gene[i], 'x', produtos[i].nome, '=> R$', melhor.gene[i] * produtos[i].valor.toFixed(2));
  }
  console.log('Peso total', pesoTotal, '- Valor total R$', melhor.valor.toFixed(2));
};

processa();