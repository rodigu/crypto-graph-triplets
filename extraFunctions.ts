// Interfaces and types
export type ExchangeList = Array<{
  symbol:string, base:string, quote:string, price:string
}>;

export type EdgeMap = Array<{base:string,quote:string}>;

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

export async function writeCSV (rows:Array<Array<string|number>>) {
  let csv:string = '';
  rows.forEach(row => {
    row.forEach((element,i) => {
      csv += `${element + (i === row.length - 1 ? '\n' : ',')}`;
    });
  });
  await Deno.writeTextFile('./networkMatrix.csv', csv);
}

export async function writeNetworkMatrixCSV (exchangeList:ExchangeList, currencies:Array<string>) {
  const numberRows = currencies.length + 1;
  let rows:Array<Array<string|number>> = [...Array(numberRows)].map(e => Array(numberRows).fill(0));
  const edgeMap = await getEdgeMap(exchangeList);
  currencies.forEach((baseCurrency, i) => {
    rows[0][i + 1] = baseCurrency;
    rows[i + 1][0] = baseCurrency;
    currencies.forEach((quoteCurrency, j) => {
      if (hasEdge(edgeMap, baseCurrency, quoteCurrency)) {
        rows[i + 1][j + 1] = 1;
        rows[j + 1][i + 1] = 1;
      }
    });
  });

  await writeCSV(rows);
}

// Data manipulation functions
export function getCompleteExchangeList (exchangeRates:Array<{symbol:string,price:string}>, info:any) {
  // returns all necessary information to build a complete graph
  let { symbols } = info;
  let completeList = symbols.map((e:any)=>{
    return {symbol: e.symbol, base: e.baseAsset, quote: e.quoteAsset}
  });

  // get all possible currencies into a set
  let currencies = new Set(completeList.map((e:any)=>e.base));
  // add any currencies that might only be showing as quotes
  completeList.forEach((e:any)=>currencies.add(e.quote));

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

// network functions
export function getEdgeMap (exchangeList:ExchangeList):EdgeMap {
  let edgeMap:EdgeMap = [];
  exchangeList.forEach((exchange, i) => {
    edgeMap[i] = { base: exchange.base, quote: exchange.quote };
  });
  return edgeMap;
}

export function hasEdge (edgeMap:EdgeMap, base:string, quote:string):Boolean {
  for (let edge of edgeMap) {
    if (edge.base === base && edge.quote === quote)
      return true;
  }
  return false;
}
