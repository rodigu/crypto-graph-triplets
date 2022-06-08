import * as binance from "./fetcher/binance.ts";
import * as cycles from "./cycles/profit_cycles.ts";

const [from, list_size] = Deno.args;

async function looper(list_size = 5) {
  while (true) {
    // get exchange rates
    const exchange_rates = await binance.getExchangeRate(from);

    // get list with trades and bases/quotes
    const info = await binance.getExchangeInfo(from);

    // get parsed data
    const data = await binance.getCompleteExchangeList(exchange_rates, info);

    // create network from data
    const network = binance.getNetwork(data);

    // triplets with profits
    const tp_lst = cycles.tripletProfits(network);

    const sorted = cycles.sortTriplets(tp_lst);
    console.clear();
    console.log(
      sorted.filter((v, i) => i > sorted.length - list_size || i <= list_size)
    );
    console.log(Date.now());
    console.log(sorted[sorted.length - 1].triplet);
  }
}

looper(Math.floor(+list_size / 2));
