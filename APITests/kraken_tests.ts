import * as k from "./kraken.ts";

const assets = await k.fetchAssets();
const pairs = await k.fetchAssetPairs();

const atom_pairs = [];
for (const pair in pairs) {
  if (pairs[pair].base === "ATOM.S" || pairs[pair].quote === "ATOM.S")
    atom_pairs.push(pairs[pair]);
}
console.log(Object.keys(pairs).length, Object.keys(assets).length);

// const atoms_pais
