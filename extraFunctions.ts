// Functions for writing and reading the list of possible exchanges between currencies
export async function writeExchangeList (list:any) {
  await Deno.writeTextFile('./validExchangeList.txt', JSON.stringify(list));
}

export async function getExchangeList () {
  return [...await JSON.parse(await Deno.readTextFile('./validExchangeList.txt'))];
}

export async function getCompleteExchangeList (exchangeRates, info) {
  let { symbols } = info;
  let completeList = symbols.map(e=>{
    return {symbol: e.symbol, base: e.baseAsset, quote: e.quoteAsset}
  });

  // pair exchange rates with symbols
  let priceMap = {};
  for (let trade of exchangeRates){
    let {symbol,price} = trade;
    priceMap[symbol] = price;
  }

  completeList.forEach(
    element=>{
      element.price = priceMap[element.symbol];
    }
  );

  return completeList;
}
