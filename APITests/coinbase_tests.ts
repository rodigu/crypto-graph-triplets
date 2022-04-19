import { fetchExchangeRates, fetchExchangeRateFor } from "./coinbase.ts";
import * as nets from "https://deno.land/x/nets/mod.ts";
import * as nex from "https://deno.land/x/nets/extra.ts";

// const exchange_rates = await fetchExchangeRates();
// console.log(exchange_rates);
// await exchange_rates;

// await Deno.writeTextFile("./coinbase.json", JSON.stringify(exchange_rates));

// let k = await fetchExchangeRateFor();
// console.log(Object.keys(k.rates));

const exchanges = await JSON.parse(await Deno.readTextFile("./coinbase.json"));
await exchanges;
const net = new nets.Network({ edge_limit: 100_000, vertex_limit: 1000 });
for (const node of Object.keys(exchanges)) {
  for (const neighbor of exchanges[node]) {
    try {
      net.addEdge({ from: node, to: neighbor[0] });
    } catch (e) {
      console.log(e);
    }
  }
}

console.log("Writing adjacency Matrix");
nex.writeAdjacencyMatrix(net, "CoinbaseAdjacencyMatrix.csv");
