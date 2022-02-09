import { ExchangeList, CurrencyListType, DataType } from "./enum.ts";
import * as n from "https://deno.land/x/nets/mod.ts";

// Interfaces and types

export type Exchange = { base: string; quote: string; price?: string };

export type EdgeMap = Array<Exchange>;

export type TripletInfo = {
  triplet: n.base_id[];
  weight: number;
  index: number;
  time?: string;
};

// Functions for writing and reading the list of possible exchanges between currencies
export async function writeExchangeList(list: ExchangeList) {
  await Deno.writeTextFile("./out/ExchangeList.txt", JSON.stringify(list));
}

export async function readExchangeList() {
  return await JSON.parse(await Deno.readTextFile("./out/ExchangeList.txt"));
}

export async function writeCurrencyList(list: CurrencyListType) {
  await Deno.writeTextFile("./out/CurrencyList.txt", JSON.stringify(list));
}

export async function readCurrencyList() {
  return [
    ...(await JSON.parse(await Deno.readTextFile("./out/ExchangeList.txt"))),
  ];
}

export async function writeCSV(
  rows: Array<Array<string | number>>,
  file_name = "adjacencyMatrix.csv"
) {
  let csv = "";
  rows.forEach((row) => {
    row.forEach((element, i) => {
      csv += `${element + (i === row.length - 1 ? "\n" : ",")}`;
    });
  });
  await Deno.writeTextFile("./out/" + file_name, csv);
}

export async function writeNetworkMatrixCSV(
  exchangeList: ExchangeList,
  currencies: CurrencyListType,
  file_name = "adjacencyMatrix.csv"
) {
  const numberRows = currencies.length + 1;
  const rows: Array<Array<string | number>> = [...Array(numberRows)].map(() =>
    Array(numberRows).fill(0)
  );
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

  await writeCSV(rows, file_name);
}

// Data manipulation functions
export function getCompleteExchangeList(
  exchangeRates: Array<{ symbol: string; price: string }>,
  info: any,
  fees = 0.005
) {
  // returns all necessary information to build a complete graph
  const { symbols } = info;
  const completeList = symbols
    .filter((e: any) => e.status === "TRADING")
    .map((e: any) => {
      return { symbol: e.symbol, base: e.baseAsset, quote: e.quoteAsset };
    });

  // get all possible currencies into a set
  const currencies: Set<string> = new Set(completeList.map((e: any) => e.base));
  // add any currencies that might only be showing as quotes
  completeList.forEach((e: any) => currencies.add(e.quote));

  // pair exchange rates with symbols
  const priceMap: Map<string, string | number> = new Map();
  for (const trade of exchangeRates) {
    const { symbol, price } = trade;
    priceMap.set(symbol, +price * (1 + fees));
  }

  completeList.forEach((element: any) => {
    element.price = priceMap.get(element.symbol);
  });

  return { exchange_list: completeList, currencies: [...currencies] };
}

// network functions
export function getEdgeMap(exchangeList: ExchangeList): EdgeMap {
  const edgeMap: EdgeMap = [];
  exchangeList.forEach((exchange, i) => {
    edgeMap[i] = { base: exchange.base, quote: exchange.quote };
  });
  return edgeMap;
}

export function hasEdge(
  edgeMap: EdgeMap,
  base: string,
  quote: string
): boolean {
  for (const edge of edgeMap) {
    if (edge.base === base && edge.quote === quote) return true;
  }
  return false;
}

export function getNonNeighbors(data: DataType, CUR: string): Array<string> {
  const cur_n = getNeighborExchanges(data, CUR);
  // currencies that are not neighbors of CUR
  return data.currencies.filter(
    (c: string) => !cur_n.filter((n) => n.base === c || n.quote === c).length
  );
}

export function getNeighbors(
  currency: string,
  exchangeList: ExchangeList
): Array<string> {
  const neighbors: Array<string> = [];
  exchangeList.forEach((exchange) => {
    if (currency === exchange.base) neighbors.push(exchange.quote);
    if (currency === exchange.quote) neighbors.push(exchange.base);
  });

  return neighbors;
}

export function getNeighborExchanges(data: DataType, CUR: string): EdgeMap {
  // list of currency neighbors, where CUR is the string code for a currency (ex. 'BTC')
  return data.exchange_list.filter(
    (e: Exchange) => e.base === CUR || e.quote === CUR
  );
}

export function removeCurrencies(
  data: DataType,
  currencies: string[]
): DataType {
  const data_copy = { ...data };
  data_copy.currencies = data_copy.currencies.filter(
    (currency) => currencies.indexOf(currency) == -1
  );
  data_copy.exchange_list = data_copy.exchange_list.filter(
    (exchange) =>
      currencies.indexOf(exchange.base) == -1 &&
      currencies.indexOf(exchange.quote) == -1
  );
  return data_copy;
}

/**
 * Returns a core-2 network with sorted edges (from > to)
 * @param  {DataType} data
 */
export function createNet(data: DataType) {
  const [vertex_limit, edge_limit] = [
    data.currencies.length,
    data.exchange_list.length,
  ];
  const network = new n.Network({ vertex_limit, edge_limit });

  const list = data.exchange_list.map((exchange) => {
    const { base, quote } = exchange;
    const price = +exchange.price;
    const [from, to] = [base, quote].sort();
    const weight = base === from ? price : 1 / price;
    return { weight, from, to };
  });

  network.addEdgeListArgs(list);

  return network.core(2);
}

export function tripletProfits(network: n.Network): TripletInfo[] {
  const triplets = network.triplets();
  const profit_list = triplets.map(([v1, v2, v3], index) => {
    let triplet_weight = network.edgeBetween(v1, v2)?.weight ?? 0;
    triplet_weight *= network.edgeBetween(v2, v3)?.weight ?? 0;
    triplet_weight *= 1 / (network.edgeBetween(v1, v3)?.weight ?? 1);
    return { triplet: [v1, v2, v3], weight: triplet_weight, index };
  });

  return profit_list;
}

export function sortTriplets(triplets: TripletInfo[]) {
  return triplets.sort((a, b) => (a.weight > b.weight ? 1 : -1));
}

/**
 * Margin in percentage: .2 is 20%
 * @param  {TripletInfo[]} triplets
 * @param  {number} margin
 */
export function profitMarginTriplets(
  triplets: TripletInfo[],
  margin: number,
  max_margin = 1
) {
  return triplets.filter(
    ({ weight }) =>
      (weight - 1 > margin && weight - 1 < max_margin) ||
      (1 / weight - 1 > margin && 1 / weight - 1 < max_margin)
  );
}
