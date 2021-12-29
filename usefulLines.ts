
//------------------------------------------------------------------------

// to import into the deno runtime
let api;
import("./req.ts").then(r => api = r);
let ext;
import("./extraFunctions.ts").then(r => ext = r);

let mc;
import("./maxClique.ts").then(r => mc = r);

// get exchange rates
let exchangeRates = await api.getExchangeRate();

// get list with trades and bases/quotes
let info = await api.getExchangeInfo();

let data = await ext.getCompleteExchangeList(exchangeRates,info);

mc.maxClique(data.currencies,data.exchangeList,['BTC','ETH'])

ext.writeNetworkMatrixCSV(data.exchangeList,data.currencies)

ext.writeExchangeList(data.exchangeList)
ext.writeCurrencyList(data.currencies)


let { symbols } = data;
let listWithSymbols = symbols.map(e=>{
  return {symbol: e.symbol, base: e.baseAsset, quote: e.quoteAsset}
});

// test to see if the first currency is always the base
console.log(listWithSymbols.filter(e => { e.symbol.slice(0,e.base.length) === e.base }))
// if the list is empty, the base always comes first

// get all possible currencies into a set
let currencies = new Set(listWithSymbols.map(e=>e.baseAsset));
// add any currencies that might only be showing as quotes
currencies.add(new Set(listWithSymbols.map(e=>e.quoteAsset)));
// as of 12/17/21, there are 470 currencies (only one of which showed up exclusively as quote)

// pair exchange rates with symbols
let priceMap = {};
for (let trade of exchangeRates){
  let {symbol,price} = trade;
  priceMap[symbol] = price;
}

listWithSymbols.forEach(
  element=>{
    element.price = priceMap[element.symbol];
  }
);
