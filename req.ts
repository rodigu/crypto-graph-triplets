async function fetchExchange (currency:string) {
  let link:string = `https://api.binance.com/api/v3/ticker/price`
  currency === 'all'? 1 : link += `?symbol=${currency}`;
  try {
    const response = await fetch(link);
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

// gets exchange rate between two or all currencies
export async function getExchangeRate (currency:string = 'all') {
  console.log('Fetching...');
  return await renderData(currency);
}

// gets info for all possible currency trades
export async function getExchangeInfo () {
  let link:string = 'https://api.binance.com/api/v3/exchangeInfo';
  try {
    const response = await fetch(link);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
// console.log(await getExchangeRate());
