import * as nets from "https://deno.land/x/nets/mod.ts";
import * as nex from "https://deno.land/x/nets/extra.ts";

export type TripletInfo = {
  triplet: nets.base_id[];
  weight: number;
};

export async function exportQuadruplets(csv: string, file: string) {
  const net = await nex.loadAdjacencyMatrix(csv);

  const quadruplets = net.quadruplets();

  await Deno.writeTextFile(file, JSON.stringify(quadruplets));
}

export async function exportTriplets(csv: string, file: string) {
  const net = await nex.loadAdjacencyMatrix(csv);

  const triplets = net.triplets();

  await Deno.writeTextFile(file, JSON.stringify(triplets));
}

export function tripletProfits(network: nets.Network): TripletInfo[] {
  const triplets = network.triplets();

  const profit_list = triplets.map((triplet) => {
    const [v1, v2, v3] = triplet.vertex_list.map((v) => v.id);
    return {
      triplet: [v1, v2, v3],
      weight: triplet.product,
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
