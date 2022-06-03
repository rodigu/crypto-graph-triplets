type CoinbaseCurrencyList = Array<{
  id: string;
  name: string;
  min_size: string;
}>;

type CurrencyExchangeRate = {
  currency: string;
  rates: { [key: string]: number };
};

type ExchangeRateMap = { [key: string]: [string, number][] };

export async function fetchCurrencies(): Promise<CoinbaseCurrencyList> {
  const link = "https://api.coinbase.com/v2/currencies";

  const currencies = (await fetch(link)).json();
  return (await currencies).data;
}

export async function fetchExchangeRates(): Promise<ExchangeRateMap> {
  const currency_list = await fetchCurrencies();
  const exchange_rates: ExchangeRateMap = {};
  for (const { id } of currency_list)
    exchange_rates[id] = Object.entries(
      (await fetchExchangeRateFor(id)).rates
    ).filter((e) => e[1] > 0);

  return exchange_rates;
}

export async function fetchExchangeRateFor(
  currency = "USD"
): Promise<CurrencyExchangeRate> {
  const link = `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`;

  const exchange_rates = (await fetch(link)).json();
  return (await exchange_rates).data;
}

export function sleep(millis = 1000) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
