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

export function getTriplets(network: n.Network, margin = 0.02) {
  const triplet_list = ext.tripletProfits(network);

  ext.sortTriplets(triplet_list);

  const triplet_1p = ext.profitMarginTriplets(triplet_list, margin);

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
    pad(new Date().getMonth() + "", 2) +
    pad(new Date().getDay() + "", 2)
  );
}

function pad(num: string, size: number): string {
  while (num.length < size) num = "0" + num;
  return num;
}

async function history(time: number) {
  const start = new Date().getTime();

  time *= 1000;
  let file = [];

  let prev_date = getDate();
  try {
    file = await JSON.parse(
      await Deno.readTextFile(`./history/${prev_date}.json`)
    );
    await file;
  } catch (e) {
    console.log(e);
  }
  while (new Date().getTime() - start < time) {
    const date = getDate();
    const start_UTC = new Date().getTime();

    const start_time = getTime();

    const fetch_start = new Date().getTime();
    const network = await fetchData();
    await network;
    const fetch_time = new Date().getTime() - fetch_start;

    const start_triplets = new Date().getTime();
    const triplets = ext.tripletProfits(network);
    ext.sortTriplets(triplets);
    const end_triplets = new Date().getTime();

    const end_UTC = new Date().getTime();

    file.push({
      start_UTC,
      end_UTC,
      start_time: start_time, // time data was fetched
      end_time: getTime(),
      time_taken_total: (end_UTC - start_UTC) / 1000,
      time_taken_triplets: (end_triplets - start_triplets) / 1000,
      fetch_time,
      triplets,
    });

    console.log(
      `\n--------\nPrev Date: ${prev_date}\nDate: ${date}\nArray size: ${
        file.length
      }\nFetch Time: ${fetch_time / 1000}\nTriplets time: ${
        (end_triplets - start_triplets) / 1000
      }\nTotal time taken: ${(end_UTC - start_UTC) / 1000}`
    );

    if (prev_date !== date) {
      await Deno.writeTextFile(
        `./history/${prev_date}.json`,
        JSON.stringify(file)
      );
      file = [];
      prev_date = getDate();
    }
  }
  await Deno.writeTextFile(`./history/${prev_date}.json`, JSON.stringify(file));
}

history(60);
