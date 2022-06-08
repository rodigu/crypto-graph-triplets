import * as binance from "./fetcher/binance.ts";

const [FROM, TIME, DELAY, FOLDER] = Deno.args;

const run_length = +TIME * 60 * 1000;
const delay = +DELAY * 1000;
const start_time = Date.now();

function pad(num: string, size: number): string {
  while (num.length < size) num = "0" + num;
  return num;
}

function sleep(millis = 1000) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

let number_of_files = 0;

while (Date.now() - start_time <= run_length) {
  // get exchange rates
  const exchange_rates = await binance.getExchangeRate(FROM);

  // get list with trades and bases/quotes
  const info = await binance.getExchangeInfo(FROM);

  // get parsed data
  const data = await binance.getCompleteExchangeList(exchange_rates, info);

  const dt = new Date();
  const file_name = `${dt.getFullYear()}-${pad(
    (dt.getMonth() + 1).toString(),
    2
  )}-${pad(dt.getHours().toString(), 2)}-${pad(
    dt.getMinutes().toString(),
    2
  )}-${pad(dt.getSeconds().toString(), 2)}`;
  Deno.writeTextFile(`./${FOLDER}/${file_name}.json`, JSON.stringify(data));

  console.clear();
  console.log(
    `Registered ${++number_of_files} files in ${
      (Date.now() - start_time) / (60 * 1000)
    } minutes.`
  );
  console.log(`Latest processed file: ${file_name}.json`);

  await sleep(delay);
}
