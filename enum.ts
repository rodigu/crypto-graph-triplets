export type ExchangeList = Array<{
  symbol:string, base:string, quote:string, price:string
}>;

export type CurrencyListType = string[];

export type DataType = { exchangeList:ExchangeList, currencies:CurrencyListType };