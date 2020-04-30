const {
  TAMANHO_POPULACAO,
  NUMERO_DE_GERACOES,
  NUMERO_REPETE,
  NUMERO_COMBINA,
  NUMERO_ALEATORIO} = require('./config');
const util = require('./util');

module.exports = function AlgoritmoGenetico({
  tamanhoDaPopulacao          = TAMANHO_POPULACAO,
  numeroDeElementosMantidos   = NUMERO_REPETE,
  numeroDeElementosCombinados = NUMERO_COMBINA,
  numeroDeElementosAleatorios = NUMERO_ALEATORIO,
  numeroDeGeracoes            = NUMERO_DE_GERACOES,
  funcaoGerarGeneAleatorio,
  funcaoValorGene,
  onNovaGeracao
}) {
  const gerarPopulacaoInicial = () => {
    let populacao = [];
    for (let i = 0; i < tamanhoDaPopulacao; i++) {
      populacao.push(funcaoGerarGeneAleatorio());
    }
    return populacao;
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

  const comparaGenes = (geneA, geneB) => {
    return funcaoValorGene(geneB) - funcaoValorGene(geneA);
  };

  const melhorGene = (populacao) => {
    populacao.sort(comparaGenes);
    return {gene: populacao[0], valor: funcaoValorGene(populacao[0])};
  };

  const proximaGeracao = (populacao) => {
    // ordena a população do maior valor para o menor
    populacao.sort(comparaGenes);

    let novaPopulacao = [];

    // os melhores passam para a próxima geração
    for (let i = 0; i < numeroDeElementosMantidos; i++) {
      novaPopulacao.push(populacao[i]);
    }

    // os melhores são combinados e passam para a próxima geração
    for (let i = 0; i < numeroDeElementosCombinados; i++) {
      let a = util.range(0, numeroDeElementosCombinados);
      let b = util.range(0, numeroDeElementosCombinados);
      novaPopulacao.push(combina(populacao[a], populacao[b]));
    }

    // o restante é gerado aleatoriamente
    for (let i = 0; i < numeroDeElementosAleatorios; i++) {
      novaPopulacao.push(funcaoGerarGeneAleatorio());
    }

    return novaPopulacao;
  };

  const executa = () => {
    return new Promise((resolve, reject) => {
      let populacao = gerarPopulacaoInicial();

      for (let i = 0; i < numeroDeGeracoes; i++) {
        populacao = proximaGeracao(populacao);
        onNovaGeracao(melhorGene(populacao), i);
      }

      resolve(melhorGene(populacao));  
    });
  };

  return {
    executa
  };
};
