import * as f from "./ftx.ts";

const markets = await f.fetchMarkets();
const currencies = new Set(
  ...[
    markets.map(({ baseCurrency }) => baseCurrency),
    markets.map(({ quoteCurrency }) => quoteCurrency),
  ]
);
const null_markets = markets.filter(
  (market) => !market.baseCurrency || !market.quoteCurrency
);

const valid_markets = markets.filter(
  (market) => market.baseCurrency && market.quoteCurrency
);
console.log(null_markets[0], valid_markets[0]);
console.log(null_markets.length, currencies.size);
