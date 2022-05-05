import * as nets from "https://deno.land/x/nets/mod.ts";
import * as nex from "https://deno.land/x/nets/extra.ts";
import * as ftx from "./ftx_tests.ts";
import * as cry from "./crypto.ts";

export type TripletInfo = {
  triplet: nets.base_id[];
  weight: number;
};

async function exportQuadruplets(csv: string, file: string) {
  const net = await nex.loadAdjacencyMatrix(csv);

  const quadruplets = net.quadruplets();

  await Deno.writeTextFile(file, JSON.stringify(quadruplets));
}

async function exportTriplets(csv: string, file: string) {
  const net = await nex.loadAdjacencyMatrix(csv);

  const triplets = net.triplets();

  await Deno.writeTextFile(file, JSON.stringify(triplets));
}

function tripletProfits(network: nets.Network): TripletInfo[] {
  const triplets = network.triplets();

  const profit_list = triplets.map((triplet) => {
    const [v1, v2, v3] = triplet.vertex_list.map((v) => v.id);
    return {
      triplet: [v1, v2, v3],
      weight: Math.abs(1 - triplet.product),
    };
  });

  return profit_list;
}

export function sortTriplets(triplets: TripletInfo[]) {
  return triplets.sort((a, b) => (a.weight > b.weight ? 1 : -1));
}

export function profitMarginTriplets(triplets: TripletInfo[], margin: number) {
  return triplets.filter(({ weight }) => weight > margin);
}

export function sortQuad(triplets: nets.Cycle[]) {
  return triplets.sort((a, b) => (a.product > b.product ? 1 : -1));
}

export function profitMarginQuad(triplets: nets.Cycle[], margin: number) {
  return triplets.filter(({ product }) => Math.abs(product - 1) > margin);
}

function exportFiles() {
  exportQuadruplets("./FTXAdjacencyMatrix.csv", "./ftx_quadruplets.json");
  exportTriplets("./FTXAdjacencyMatrix.csv", "./ftx_triplets.json");

  exportQuadruplets("./CryptoAdjacencyMatrix.csv", "./crypto_triplets.json");
  exportTriplets("./CryptoAdjacencyMatrix.csv", "./crypto_triplets.json");
}

async function analyzeTripletsCry() {
  const t = await cry.ticker();
  await t;

  const network = cry.generateNetwork(t.data);
  const t_profits = profitMarginTriplets(
    sortTriplets(tripletProfits(network)),
    0.01
  );

  console.log(t_profits);
}

async function analyzeTripletsFTX() {
  const network = await ftx.generateNetwork();
  const t_profits = profitMarginTriplets(
    sortTriplets(tripletProfits(network)),
    0.01
  );

  const t_lst = ["USDT", "USD", "EOSBEAR"];
  console.log(t_profits);
  console.log(network.edgeBetween(t_lst[0], t_lst[1]));
  console.log(network.edgeBetween(t_lst[0], t_lst[2]));
  console.log(network.edgeBetween(t_lst[2], t_lst[1]));
}

async function analyzeQuadCry() {
  const network = await ftx.generateNetwork();
  const start = Date.now();
  const quad_p = profitMarginQuad(sortQuad(network.quadruplets()), 0.01);
  console.log(
    quad_p[50],
    quad_p.length,
    (Date.now() - start) / 1000,
    quad_p.map(({ product }) => product)
  );
}

async function analyzeQuadFTX() {
  const t = await cry.ticker();
  await t;

  const network = cry.generateNetwork(t.data);
  const start = Date.now();
  // const quad_p = profitMarginQuad(sortQuad(network.quadruplets()), 0.01);
  const quad_p = profitMarginQuad(sortQuad(network.quadruplets()), 0.01);
  console.log(
    quad_p.length,
    quad_p.map(({ product }) => product),
    (Date.now() - start) / 1000
  );
}

// const t = await cry.ticker();
// await t;

// const network = cry.generateNetwork(t.data);

// console.log(network.ranked_neighborhood);

[
  "USDT",
  "USDC",
  "BTC",
  "CRO",
  "ATOM",
  "ENJ",
  "ETH",
  "LINK",
  "DOT",
  "VET",
  "ADA",
  "XRP",
];
await analyzeQuadCry();
console.log("\n---\n");
await analyzeQuadFTX();
console.log("\n---\n");
await analyzeTripletsFTX();
console.log("\n---\n");
await analyzeTripletsCry();
