import axiod from "https://deno.land/x/axiod/mod.ts";

async function fetchExchange (currency:string) {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/exchangeInfo?symbols=["${currency}"]`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function renderData (currency:string) {
  const data = await fetchExchange(currency);
  return data;
}

export async function getExchangeRate (currency:string = 'BTCUSDT') {
  console.log('Fetching...');
  let apiData:any;
  axiod.get(`https://api.binance.com/api/v3/exchangeInfo?symbols=["${currency}"]`)
    .then(async function (response) {
      return await response.data;
    });
}

// console.log(await getExchangeRate());
