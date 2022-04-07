import * as nets from "https://deno.land/x/nets/mod.ts";
import * as nex from "https://deno.land/x/nets/extra.ts";

export type Ticker = {
  i: string;
  b: number;
  k: number;
  a: number;
  t: number;
  v: number;
  h: number;
  l: number;
  c: number;
};

export async function ticker(): Promise<{ data: Ticker[] }> {
  const link = `https://api.crypto.com/v2/public/get-ticker`;

  const response = (await fetch(link)).json();
  const markets = (await response).result;
  return markets;
}

export function generateNetwork(exchanges: Ticker[]): nets.Network {
  const network = new nets.Network();

  network.addEdgeListArgs(
    exchanges.map((exchange) => {
      const currencies = exchange.i.split("_");
      return { from: currencies[0], to: currencies[1], weight: exchange.a };
    })
  );

  return network;
}

const t = await ticker();
await t;

const network = generateNetwork(t.data);
nex.writeAdjacencyMatrix(network, "CryptoAdjacencyMatrix.csv");
// console.log(network.ranked_neighborhood);
// network.triplets();
