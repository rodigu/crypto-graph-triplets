import * as binance from "./fetcher/binance_ticker.ts";

function sleep(millis = 1000) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

async function loop(delay = 1) {
  while (true) {
    const { network, ticker } = await binance.tickerAndNetwork();
    const tick_map = binance.getTickMap(ticker);
    const triplets = binance.tickerTriplets({ network, tick_map });
    triplets.sort((a, b) => (a.weight > b.weight ? 1 : -1));

    console.clear();
    console.log(Date.now());
    console.log(triplets.splice(triplets.length - 10, triplets.length));

    await sleep(1000 * delay);
  }
}

const delay = Deno.args[0] || 0.5;

loop(+delay);
