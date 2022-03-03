import { graphData } from "./data_vis.ts";

let data_hist = [];
for (let i = 18; i <= 23; i++)
  data_hist.push(
    ...(await JSON.parse(
      await Deno.readTextFile(`./history/20220203${i}.json`)
    ))
  );

let most_proft = data_hist.map((point: any) =>
  Math.max(
    1 - point.triplets[0].weight,
    point.triplets[point.triplets.length - 1].weight - 1
  )
);

let trip = ["OMG", "USD", "USDT"];

let omg_triplet = data_hist.map(
  (point: any) =>
    point.triplets.find((triplet: any) =>
      trip.every((c) => triplet.triplet.indexOf(c) !== -1)
    ).weight
);

graphData(omg_triplet, "omg.png", 0.95, 1.05, { width: 10, height: 10 });

graphData(most_proft, "most_profitable.png", 0, 0.05);
