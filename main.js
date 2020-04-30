const util = require('./util');
const produtos = require('./dados');
const { CAPACIDADE_MOCHILA } = require('./config');
const AlgoritmoGenetico = require('./genetic');

const geneAleatorio = () => {
  let gene = [];

  // monta a mochila colocando quantidades aleatórias de cada produto
  produtos.forEach(produto => {
    gene.push(util.range(0, produto.quantidade + 1));
  });

  return gene;
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

const imprimeMelhorGeneParcial = (melhor, geracao) => {
  let pesoTotal = melhor.gene.map((qtd, indice) => produtos[indice].peso * qtd).reduce((a, b) => a + b, 0);
  console.log(geracao, 'Peso total', pesoTotal, '- Valor total R$', melhor.valor.toFixed(2));
};

const imprimeMelhorGene = (melhor) => {
  console.log('FIM DA EXECUÇÃO DO ALGORITMO GENÉTICO');

  let tabela = [];
  let pesoTotal = melhor.gene.map((qtd, indice) => produtos[indice].peso * qtd).reduce((a, b) => a + b, 0);
  let qtdTotal = melhor.gene.reduce((a, b) => a + b, 0);

  for (let i = 0; i < melhor.gene.length; i++) {
    tabela.push({
      item: produtos[i].nome,
      peso: produtos[i].peso,
      valor: produtos[i].valor,
      qtd: melhor.gene[i],
      peso_total: melhor.gene[i] * produtos[i].peso,
      valor_total: 'R$ ' + (melhor.gene[i] * produtos[i].valor).toFixed(2)
    });
  }

  tabela.push({
    item: '-',
    peso: '-',
    valor: '-',
    qtd: qtdTotal,
    peso_total: pesoTotal,
    valor_total: 'R$ ' + melhor.valor.toFixed(2)
  });

  console.table(tabela);
};

const algogen = new AlgoritmoGenetico({
  funcaoGerarGeneAleatorio: geneAleatorio,
  funcaoValorGene: valor,
  onNovaGeracao: imprimeMelhorGeneParcial
});

algogen.executa().then(imprimeMelhorGene);