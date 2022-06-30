import * as nets from "https://deno.land/x/nets/mod.ts";

export type Tick = {
  symbol: string;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
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

export type APIInfo = {
  timezone: string;
  serverTime: number;
  rateLimits: APIRateLimits[];
  exchangeFilters: any[];
  symbols: APISymbol[];
};

export async function getExchangeInfo(from = "us"): Promise<APIInfo> {
  const link = `https://api.binance.${from}/api/v3/exchangeInfo`;
  const response = await fetch(link);
  const data = await response.json();
  return data;
}

export type SymbolMap = Map<string, { base: string; quote: string }>;
export type TickMap = Map<string, Tick>;

export function tickerTriplets(args: {
  network: nets.Network;
  tick_map: TickMap;
}) {
  const { network, tick_map } = args;
  const triplets = network.triplets();
  return triplets.map((triplet) => {
    const vertices = triplet.vertex_list.map((v) => v.id);
    let pivot = vertices[0];
    let weight = 1;

    for (let i = 1; i <= vertices.length; i++) {
      const index = i % vertices.length;

      let edge_weight = 1;
      if (tick_map.get(vertices[index] + "" + pivot) === undefined) {
        edge_weight = +tick_map.get(pivot + "" + vertices[index])?.bidPrice!;
      } else {
        edge_weight =
          1 / +tick_map.get(vertices[index] + "" + pivot)?.askPrice!;
      }

      weight *= edge_weight;
      pivot = vertices[index];
    }
    return { vertices, weight };
  });
}

export function getTickMap(ticks: Tick[]): TickMap {
  const tick_map = new Map();
  ticks.forEach((tick) => {
    tick_map.set(tick.symbol, tick);
  });
  return tick_map;
}

export async function getSymbols(from = "us"): Promise<SymbolMap> {
  const data = await getExchangeInfo(from);
  await data;
  const symbols_map = new Map();
  data.symbols.forEach((symbol) => {
    symbols_map.set(symbol.symbol, {
      base: symbol.baseAsset,
      quote: symbol.quoteAsset,
    });
  });

  return symbols_map;
}

export async function tickerAndNetwork(domain = "us") {
  const link = `https://api.binance.${domain}/api/v3/ticker/bookTicker`;
  const response = await fetch(link);
  const ticker: Tick[] = await response.json();
  const symbols = await getSymbols(domain);
  const network = getTickerNetwork(ticker, symbols);
  return { network, ticker };
}

export function getTickerNetwork(tick_list: Tick[], symbols: SymbolMap) {
  const network = new nets.Network({
    vertex_limit: tick_list.length,
    edge_limit: tick_list.length,
  });

  tick_list.forEach((tick) => {
    const { base, quote } = symbols.get(tick.symbol)!;
    if (+tick.bidQty !== 0 && +tick.askQty !== 0)
      network.addEdge({ from: base, to: quote });
  });

  return network;
}
