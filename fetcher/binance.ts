import * as nets from "https://deno.land/x/nets/mod.ts";

export type ExchangeList = Array<Exchange>;

export type Exchange = {
  symbol: string;
  base: string;
  quote: string;
  price?: number | string;
};

export type CurrencyListType = string[];

export type DataType = {
  exchange_list: ExchangeList;
  currencies: CurrencyListType;
};

export type APIExchangeRates = APIExchangeRate[];

export type APIExchangeRate = { symbol: string; price: string };

export type APIInfo = {
  timezone: string;
  serverTime: number;
  rateLimits: APIRateLimits[];
  exchangeFilters: any[];
  symbols: APISymbol[];
};

export type APIRateLimits = {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
  [k: string]: string | number;
};

export type APISymbol = {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  [k: string]: string | number;
};

export type APIFilter = {
  filterType: string;
  [k: string]: string | number;
};

/**
 * Returns a promise with the API's price object
 * @param  {string} currency="all"
 * @returns Promise<APIExchangeRates>
 */
export async function getExchangeRate(
  from = "com",
  currency = "all"
): Promise<APIExchangeRates> {
  let link = `https://api.binance.${from}/api/v3/ticker/price`;
  currency === "all" ? 1 : (link += `?symbol=${currency}`);
  const response = await fetch(link);
  const data = await response.json();
  return data;
}

export let LAST = new Date().getTime();

function sleep(millis = 1000) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

/**
 * Returns a promise with the API's exchangeInfo object
 * @returns Promise<APIInfo>
 */
export async function getExchangeInfo(from = "com"): Promise<APIInfo> {
  const link = `https://api.binance.${from}/api/v3/exchangeInfo`;
  const response = await fetch(link);
  const data = await response.json();
  await sleep(1000 - (new Date().getTime() - LAST));
  LAST = new Date().getTime();
  return data;
}

export function getCompleteExchangeList(
  exchangeRates: APIExchangeRates,
  info: APIInfo,
  fees = 0.01
) {
  // returns all necessary information to build a complete graph
  const { symbols } = info;
  const completeList: Exchange[] = symbols
    .filter((e) => e.status === "TRADING")
    .map((e) => {
      return { symbol: e.symbol, base: e.baseAsset, quote: e.quoteAsset };
    });

  // get all possible currencies into a set
  const currencies: Set<string> = new Set(completeList.map((e) => e.base));
  // add any currencies that might only be showing as quotes
  completeList.forEach((e) => currencies.add(e.quote));

  // pair exchange rates with symbols
  const priceMap: Map<string, string | number> = new Map();
  for (const trade of exchangeRates) {
    const { symbol, price } = trade;
    priceMap.set(symbol, +price * (1 + fees));
  }

  completeList.forEach((element) => {
    element.price = priceMap.get(element.symbol);
  });

  return { exchange_list: completeList, currencies: [...currencies] };
}

/**
 * Returns a core-2 network with sorted edges (from > to)
 * @param  {DataType} data
 */
export function getNetwork(data: DataType) {
  const [vertex_limit, edge_limit] = [
    data.currencies.length,
    data.exchange_list.length,
  ];
  const network = new nets.Network({ vertex_limit, edge_limit });

  const list = data.exchange_list.map((exchange) => {
    const { base, quote } = exchange;
    const price = +(exchange.price ?? 0);
    const [from, to] = [base, quote].sort();
    const weight = base === from ? price : 1 / price;
    return { weight, from, to };
  });

  network.addEdgeListArgs(list);

  return network.core(2);
}
