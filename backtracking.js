const produtos = require('./dados');
const { CAPACIDADE_MOCHILA } = require('./config');

// essa é a função que tentaremos maximizar
const valor = (mochila) => {
  let pesoTotal = mochila.map((qtd, indice) => produtos[indice].peso * qtd).reduce((a, b) => a + b, 0);

  if (pesoTotal > CAPACIDADE_MOCHILA) {
    return 0; // não pode exceder a capacidade total da mochila
  }

  let valorTotal = mochila.map((qtd, indice) => qtd * produtos[indice].valor).reduce((a, b) => a + b, 0);
  return valorTotal;
};

let melhorMochila = null;
let maiorValor = -1;

const executa = (mochila, visitados) => {
  if (visitados.size === produtos.length) {
    return;
  }

  // para cada um dos produtos
  for (let i = 0; i < produtos.length; i++) {
    // se eu ainda não visitei
    if (!visitados.has(i)) {
      visitados.add(i); // marca o produto como visitado
      // testa todas as quantidades
      for (let j = 0; j <= produtos[i].quantidade; j++) {
        mochila[i] = j;

        let valorAtual = valor(mochila);
        if (valorAtual > maiorValor) {
          melhorMochila = [...mochila];
          maiorValor = valor(mochila);
          console.log('melhor até aqui:', maiorValor);
        }

        // chama recursivamente
        executa(mochila, visitados);
      }
      // desmarca como visitado
      visitados.delete(i);
    }
  }
};

executa([], new Set());