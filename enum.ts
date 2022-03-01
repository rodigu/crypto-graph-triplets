export type ExchangeList = Array<Exchange>;

export type Exchange = {
  symbol: string;
  base: string;
  quote: string;
  price?: number | string;
};

export type CurrencyListType = string[];

export type DataType = {
  exchange_list: ExchangeList;
  currencies: CurrencyListType;
};

export type APIExchangeRates = APIExchangeRate[];

export type APIExchangeRate = { symbol: string; price: string };

export type APIInfo = {
  timezone: string;
  serverTime: number;
  rateLimits: APIRateLimits[];
  exchangeFilters: any[];
  symbols: APISymbol[];
};

export type APIRateLimits = {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
  [k: string]: string | number;
};

export type APISymbol = {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  [k: string]: string | number;
};

export type APIFilter = {
  filterType: string;
  [k: string]: string | number;
};
