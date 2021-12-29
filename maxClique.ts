import { ExchangeList, Exchange, getNeighbors } from './extraFunctions.ts';

export function isClique (currency_list:Array<string>, exchange_list:ExchangeList) : Boolean {
  //  Takes in a list of currencies that migh make a clique, and the complete
  // network which contains these currencies
  let result = true
  currency_list.forEach(currency => {
    let neighbors = getNeighbors(currency, exchange_list);
    currency_list.forEach(c=>{
      if (c !== currency && neighbors.indexOf(c)===-1){
        result = false;
        return;
      }
    });
    if (!result) return;
  });
  return result;
}

export function largerSubGraph (graphA:Array<string>, graphB:Array<string>):Array<string> {
  let larger_graph = Math.max(graphA.length, graphB.length) === graphA.length ? graphA : graphB;
  return larger_graph;
}

export function maxClique (currency_list:Array<string>,exchange_list:ExchangeList, min_neighbors:Array<string>) : Array<string> {
  // min_neighbors
  let max_clique:Array<string> = [...min_neighbors];
  currency_list.forEach((currency) => {
    if (max_clique.indexOf(currency) > -1) return;
    let temp_max_clique = [currency, ...max_clique];
    console.log(max_clique)
    if (isClique(temp_max_clique, exchange_list)) {
      max_clique = largerSubGraph(temp_max_clique, max_clique);
      max_clique = largerSubGraph(max_clique, maxClique(currency_list, exchange_list, max_clique));
    }
  });
  return max_clique;
}
