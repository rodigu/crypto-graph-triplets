import * as cycle from "./cycles/profit_cycles.ts";
import * as binance from "./fetcher/binance.ts";

export type TimeSeries = {
  date: string[];
  triplet_weight: number[];
};

/*
Python datetime convert
format = "%Y-%m-%H-%M-%S"
After update
format = "%Y-%m-%H-%d-%M-%S"
*/

export async function generateTimeSeriesFor(
  triplet: string[],
  show_progress = false,
  folder_name = "history_us"
) {
  console.clear();
  const initial_time = Date.now();
  const series: TimeSeries = { date: [], triplet_weight: [] };
  let current = 0;
  for await (const entry of Deno.readDir(`./${folder_name}`)) {
    if (entry.isFile) {
      const { name } = entry;
      series.date[current] = name.slice(0, name.length - ".json".length);
      const data: binance.DataType = JSON.parse(
        await Deno.readTextFile(`./${folder_name}/${name}`)
      );
      await data;
      series.triplet_weight[current] =
        cycle.tripletProfits(binance.getNetwork(data)).find((t) => {
          return (
            t.triplet.indexOf(triplet[0]) !== -1 &&
            t.triplet.indexOf(triplet[1]) !== -1 &&
            t.triplet.indexOf(triplet[2]) !== -1
          );
        })?.weight ?? 0;
      if (show_progress) {
        console.clear();
        console.log(`Triplet: ${triplet}`);
        console.log(`Currently logging: ${name}`);
        console.log(`Weight: ${series.triplet_weight[current]}`);
        console.log(`Entry no: ${current}`);
      }
      current++;
    }
  }

  console.log(`Time taken: ${(Date.now() - initial_time) / 1000} seconds`);
  return series;
}

export async function writeTimeSeriesJSON(file_name: string, data: TimeSeries) {
  await Deno.writeTextFile(file_name, JSON.stringify(data));
}

const triplet = [Deno.args[0], Deno.args[1], Deno.args[2]];
const file_name = (Deno.args[3] || ".") + "/" + triplet.join("_") + ".json";
const show_progress = !!+Deno.args[4];

writeTimeSeriesJSON(
  file_name,
  await generateTimeSeriesFor(triplet, show_progress)
);
