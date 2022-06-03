export type SymbolDetails = {
  symbol: string;
  base_currency: string;
  quote_currency: string;
  tick_size: number;
  quote_increment: number;
  min_order_size: string;
  status: string;
  wrap_enabled: boolean;
};
export async function fetchSymbols(): Promise<string[]> {
  const link = "https://api.gemini.com/v1/symbols";
  const symbols = (await fetch(link)).json();
  return await symbols;
}

export async function fetchSymbolDetails(
  symbol: string
): Promise<SymbolDetails> {
  const link = `https://api.gemini.com/v1/symbols/details/${symbol}`;
  const details = (await fetch(link)).json();
  return details;
}

export async function fetchDetailsList(
  list: string[]
): Promise<SymbolDetails[]> {
  const details = [];
  for (const symbol of list) details.push(await fetchSymbolDetails(symbol));
  return details;
}

export async function fetchTicker(symbol = "btcusd") {
  const link = `https://api.gemini.com/v2/ticker/${symbol}`;
  const ticker = (await fetch(link)).json();
  return ticker;
}

console.log(await fetchTicker());
