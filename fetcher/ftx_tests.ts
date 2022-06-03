import * as f from "./ftx.ts";
import * as nets from "https://deno.land/x/nets/mod.ts";
import * as nex from "https://deno.land/x/nets/extra.ts";

export function getCurrencies(markets: f.RawMarket[]): Set<string | null> {
  return new Set(
    ...[
      markets.map(({ baseCurrency }) => baseCurrency),
      markets.map(({ quoteCurrency }) => quoteCurrency),
    ]
  );
}

export function cleanMarkets(markets: f.RawMarket[]): f.Market[] {
  const clean_markets: f.Market[] = [];

  for (const market of markets) {
    const { baseCurrency, quoteCurrency, price } = market;
    if (baseCurrency !== null && quoteCurrency !== null) {
      const base = baseCurrency;
      const quote = quoteCurrency;
      clean_markets.push({
        baseCurrency: base,
        quoteCurrency: quote,
        price,
      });
    }
  }

  return clean_markets;
}

export async function generateNetwork(): Promise<nets.Network> {
  const net = new nets.Network({ is_directed: false });
  const markets = cleanMarkets(await f.fetchMarkets());

  markets.forEach(({ baseCurrency, quoteCurrency, price }) => {
    !net.addEdge({ from: baseCurrency, to: quoteCurrency, weight: price });
  });

  return net;
}

nex.writeAdjacencyMatrix(await generateNetwork(), "FTXAdjacencyMatrix.csv");

// markets.forEach((market) => {
//   if (!market.enabled) console.log(market);
// });
// const network = generateNetwork(cleanMarkets(markets));

// const curr = network.vertex_list.map((vertex) => vertex.id);
// const neighbors = curr.map((c) => {
//   return { id: c, n: network.neighbors(c).length };
// });
// neighbors.sort((a, b) => (a.n < b.n ? 1 : -1));

// console.log(neighbors);
