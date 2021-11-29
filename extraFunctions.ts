// Functions for writing and reading the list of possible exchanges between currencies
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

// Graph building functions
export function getNeighbors (vertice:string, list:Array<string>) {
  const neighbors:Array<string> = [];
  list.forEach(exchange => {
    const currency1:string = exchange.slice(0, vertice.length);
    const currency2:string = exchange.slice(exchange.length - vertice.length, exchange.length)
    if (currency1 === vertice)
      neighbors.push(currency2);
    else if (currency2 === vertice)
      neighbors.push(currency1);
  });

  return neighbors;
}
