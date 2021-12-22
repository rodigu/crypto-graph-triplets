// Functions for writing and reading the list of possible exchanges between currencies
export async function writeExchangeList (list:any) {
  await Deno.writeTextFile('./ExchangeList.txt', JSON.stringify(list));
}

export async function readExchangeList () {
  return await JSON.parse(await Deno.readTextFile('./ExchangeList.txt'));
}

export async function writeCurrencyList (list:any) {
  await Deno.writeTextFile('./CurrencyList.txt', JSON.stringify(list));
}

export async function readCurrencyList () {
  return [...await JSON.parse(await Deno.readTextFile('./ExchangeList.txt'))];
}

export function getCompleteExchangeList (exchangeRates:Array<{symbol:string,price:string}>, info:any) {
  // returns all necessary information to build a complete graph
  let { symbols } = info;
  let completeList = symbols.map((e:any)=>{
    return {symbol: e.symbol, base: e.baseAsset, quote: e.quoteAsset}
  });

  // get all possible currencies into a set
  let currencies = new Set(completeList.map((e:any)=>e.base));
  console.log(currencies)
  // add any currencies that might only be showing as quotes
  currencies.add(new Set(completeList.map((e:any)=>e.quote)));

  // pair exchange rates with symbols
  let priceMap:Map<string,string> = new Map();
  for (let trade of exchangeRates){
    let {symbol,price} = trade;
    priceMap.set(symbol, price);
  }

  completeList.forEach(
    (element:any)=>{
      element.price = priceMap.get(element.symbol);
    }
  );

  return { exchangeList: completeList, currencies:[...currencies] };
}
