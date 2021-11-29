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

export async function getExchangeRate (currency:string = 'all') {
  console.log('Fetching...');
  return await renderData(currency);
}

export async function writeExchangeList (list:any) {
  await Deno.writeTextFile('./validExchangeList.txt', JSON.stringify(list));
}

export async function getExchangeList () {
  return JSON.parse(await Deno.readTextFile('./validExchangeList.txt'))
}

export function createListFromData (data:Array<object>) {
  let list:Array<string> = [];
  for (let exchangeInfo of data) {
    list.push(Object.values(exchangeInfo)[0]);
  }
  return list;
}

// console.log(await getExchangeRate());
