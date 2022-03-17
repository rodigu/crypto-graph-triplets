import {
  fetchExchangeRates,
  fetchExchangeRateFor,
  fetchCurrencies,
} from "./coinbase.ts";

const start_currency_fetch = new Date().getTime();
let curr = await fetchCurrencies();
const exchange_rates = await fetchExchangeRateFor();
console.log(new Date().getTime() - start_currency_fetch);
console.log(curr.find(({ id }) => id === "JPY"));
console.log(exchange_rates);
