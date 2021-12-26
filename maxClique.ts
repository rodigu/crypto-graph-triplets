import { ExchangeList, Exchange, getNeighbors } from './extraFunctions.ts';

export function isClique (currency_list:Array<string>, exchange_list:ExchangeList) : Boolean {
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

export function maxClique (currency_list:Array<string>,exchange_list:ExchangeList, min_neighbors:Array<string>) : Array<string> {
  // min_neighbors
  let max_clique:Array<string> = [...min_neighbors];
  currency_list.forEach((currency) => {

  });
  return max_clique;
}
