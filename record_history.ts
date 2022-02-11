import * as api from "./req.ts";
import * as ext from "./extraFunctions.ts";
import * as n from "https://deno.land/x/nets/mod.ts";

async function fetchData() {
  // get exchange rates
  const exchange_rates = await api.getExchangeRate();

  // get list with trades and bases/quotes
  const info = await api.getExchangeInfo();

  const data = await ext.getCompleteExchangeList(exchange_rates, info);

  return ext.createNet(data);
}

function getTriplets(network: n.Network) {
  const triplet_list = ext.tripletProfits(network);

  ext.sortTriplets(triplet_list);

  const triplet_1p = ext.profitMarginTriplets(triplet_list, 0.005);

  return triplet_1p;
}

function getTime() {
  return (
    pad(new Date().getUTCHours() + "", 2) +
    "_" +
    pad(new Date().getUTCMinutes() + "", 2) +
    "_" +
    pad(new Date().getUTCSeconds() + "", 2)
  );
}

function getDate(): string {
  return (
    new Date().getFullYear() +
    pad(new Date().getMonth() + "1", 2) +
    pad(new Date().getDay() + "", 2)
  );
}

function pad(num: string, size: number): string {
  while (num.length < size) num = "0" + num;
  return num;
}

async function registerJSON() {
  const date = getDate();
  const start = new Date().getTime();
  let file = [];
  try {
    file = await JSON.parse(await Deno.readTextFile(`./history/${date}.json`));
    // await file;
  } catch (e) {
    console.log(e);
  }
  const time = getTime();

  const network = await fetchData();
  // await network
  const start_triplets = new Date().getTime();
  const triplets = getTriplets(network);
  const end_triplets = new Date().getTime();

  file.push({
    start_time: time, // time data was fetched
    end_time: getTime(),
    time_taken_sec: (new Date().getTime() - start) / 1000,
    time_taken_triplets: (end_triplets - start_triplets) / 1000,
    exchanges: network.edge_list.map(({ vertices, weight }) => {
      return { vertices, weight };
    }),
    triplets,
  });

  await Deno.writeTextFile(`./history/${date}.json`, JSON.stringify(file));
}

// checking how much the top triplet changed in 2 minutes

async function topRegister(min: number) {
  const start = new Date().getTime();
  let file = [];
  while (new Date().getTime() - start < min * 1000 * 60) {
    const start_algo = getTime();
    const network = await fetchData();
    const triplets = getTriplets(network);
    file.push({
      start: start_algo,
      end: getTime(),
      top1: triplets[triplets.length - 1],
      top0: triplets[0],
    });
    await Deno.writeTextFile(`./history/tst.json`, JSON.stringify(file));
  }
}

// topRegister(1);

registerJSON();
