import * as api from "./req.ts";
import * as ext from "./extraFunctions.ts";

async function getHighTriplet(): Promise<ext.TripletInfo> {
  const network = await fetchData();

  await network;

  const tp_lst = ext.tripletProfits(network);

  const high = { weight: 0, index: 0 };

  tp_lst.forEach((tp) => {
    if (tp.weight > high.weight && tp.triplet.indexOf("VEN") === -1) {
      high.weight = tp.weight;
      high.index = tp.index;
    }
  });

  const highest_tp = tp_lst[high.index];

  highest_tp.time = `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`;

  return highest_tp;
}

async function timeCalc(
  number_of_iterations: number,
  func: Function,
  func_params?: any
) {
  let time_taken = 0;
  let iterations = number_of_iterations;
  while (--iterations > 0) {
    console.log("Iteration:", number_of_iterations - iterations);
    const st = new Date().getTime();
    await func(func_params);
    time_taken += (new Date().getTime() - st) / 1000;
  }
  return time_taken / number_of_iterations;
}

async function fetchData() {
  // get exchange rates
  let exchange_rates = await api.getExchangeRate();

  // get list with trades and bases/quotes
  let info = await api.getExchangeInfo();

  let data = await ext.getCompleteExchangeList(exchange_rates, info);

  return ext.createNet(data);
}

async function BTCavg(time_delay: number) {
  const btc_1 = (await fetchData()).edgeBetween("BTC", "USDT")?.weight ?? 1;
  let btc_2 = 0;
  await sleep(time_delay);
  btc_2 = (await (await fetchData()).edgeBetween("BTC", "USDT")?.weight) ?? 1;
  return btc_1 - btc_2;
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function registeredTime(): string {
  const date = new Date();
  return date.getDate() + "_" + date.getUTCMonth() + "_" + date.getFullYear();
}

function genTripletString(triplets_info: ext.TripletInfo[]): string {
  let info_string = ``;
  triplets_info.forEach((triplet) => {
    info_string += `Recorded time: ${triplet.time}\n`;
    info_string += `Triplets: ${JSON.stringify(triplet.triplet)}\n`;
    info_string += `Weight: ${JSON.stringify(triplet.weight)}\n`;
    info_string += `Index: ${JSON.stringify(triplet.index)}\n---\n`;
  });

  return info_string;
}

/**
 * Registers highest triplets to text file.
 * Duration in seconds
 * @param  {number} duration
 */
async function record(duration: number) {
  const start_time = new Date().getTime() / 1000;
  const triplets_info: ext.TripletInfo[] = [];

  while (new Date().getTime() / 1000 - start_time < duration) {
    triplets_info.push(await getHighTriplet());
    await Deno.writeTextFile(
      `./out/triplets_${registeredTime()}.txt`,
      genTripletString(triplets_info)
    );
  }
}

async function recordTripletsJSON() {
  const network = await fetchData();

  await network;

  const tp_lst = ext
    .tripletProfits(network)
    .sort((a, b) => (a.weight > b.weight ? 1 : -1));

  await Deno.writeTextFile(
    `./out/triplets_${registeredTime()}.json`,
    JSON.stringify(tp_lst)
  );
}

recordTripletsJSON();
