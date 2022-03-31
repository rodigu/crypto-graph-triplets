import * as k from "./kraken.ts";
import * as nets from "https://deno.land/x/nets/mod.ts";

const assets = await k.fetchAssets();
const pairs = await k.fetchAssetPairs();

console.log(pairs);

const atom_pairs = [];
for (const pair in pairs) {
  if (pairs[pair].base === "XETH" || pairs[pair].quote === "XETH")
    atom_pairs.push(pairs[pair]);
}
console.log(Object.keys(pairs).length, Object.keys(assets).length);

console.log(atom_pairs);

// const atoms_pais
function generateNetwork(
  currencies: k.AssetsMap,
  exchanges: k.AssetPairsMap
): nets.Network {
  const net = new nets.Network();
  for (let exchange of Object.entries(exchanges)) {
  }
  return net;
}
