import { APIInfo, APIExchangeRates } from "./enum.ts";

/**
 * Returns a promise with the API's price object
 * @param  {string} currency="all"
 * @returns Promise<APIExchangeRates>
 */
export async function getExchangeRate(
  currency = "all"
): Promise<APIExchangeRates> {
  let link = `https://api.binance.us/api/v3/ticker/price`;
  currency === "all" ? 1 : (link += `?symbol=${currency}`);
  const response = await fetch(link);
  const data = await response.json();
  return data;
}

export let LAST = new Date().getTime();

function sleep(millis = 1000) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

/**
 * Returns a promise with the API's exchangeInfo object
 * @returns Promise<APIInfo>
 */
export async function getExchangeInfo(): Promise<APIInfo> {
  const link = "https://api.binance.us/api/v3/exchangeInfo";
  const response = await fetch(link);
  const data = await response.json();
  await sleep(1000 - (new Date().getTime() - LAST));
  LAST = new Date().getTime();
  return data;
}
