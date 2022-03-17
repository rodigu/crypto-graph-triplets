- [REPL data analysis](#repl-data-analysis)
- [03/01](#0301)
- [03/03](#0303)
- [API exporations](#api-exporations)
  - [Coinbase](#coinbase)
  - [Gemini](#gemini)
  - [Kraken](#kraken)
  - [FTX](#ftx)
  - [Crypto.com](#cryptocom)

The Python code for visualizing the network can be found in [the graphVis file](graphVis.py).

### REPL data analysis

```ts
// importing functions
let api;
import("./req.ts").then((r) => (api = r));
let ext;
import("./extraFunctions.ts").then((r) => (ext = r));

// get exchange rates
let exchange_rates = await api.getExchangeRate();

// get list with trades and bases/quotes
let info = await api.getExchangeInfo();

// get parsed data
let data = await ext.getCompleteExchangeList(exchange_rates, info);

// create network from data
let network = ext.createNet(data);

// triplets with profits
let tp_lst = ext.tripletProfits(network);

ext.sortTriplets(tp_lst);

let tp_pr = ext.profitMarginTriplets(tp_lst, 0.01);
```

Reading data from JSON:

```ts
let vis;
import("./data_vis.ts").then((r) => (vis = r));
let data_hist = await JSON.parse(
  await Deno.readTextFile("./history/FILENAME.json")
);

let most_proft = data_hist.map(({ triplets }) => triplets[0].weight);
```

### 03/01

The graph for Binance US is much smaller.
There are 272 triplets in the US Binance network.
There are 67 currencies available for trading.

![Spring Graph for Binance US](./img/us_binance.png)

The two currencies in the core are USD and USDT.
It seems to be a lot more stable than the non-US Binance market.

### 03/03

https://api.coinbase.com/v2/exchange-rates?currency=BTC

### API exporations

#### Coinbase

API entry URL: https://api.coinbase.com/v2/
It takes no moew than 500 milliseconds to fetch the currency list.
Because of the way we have to fetch exchange rates in this API,
it is unpractical to use it unless we know which
currencies we want to use, and we don't care about the other possible
links between non-core currencies.

The default exchange rates fetch (no input) returns the exchanges for USD.

There are 165 currencies in the coinbase network.
But it also includes non-crypto currencies such as JPY and BRL.

#### Gemini

Documentation: https://docs.gemini.com/rest-api/
This API also only has requests per trade.
To get the details for all 108 available trades, it takes around 10 seconds.
Just like for Coinbase, this only has the potential to work
for a set list of currencies, not for the general case, considering the response time.
Same issue with the ticker.

#### Kraken

Some currencies have a `".S"` variant.
Not sure what it is for, but they don't show up in the asset pairs fetch request.
This API is feasible for doing the calculations.
It also includes non-crypto currencies.
There are 154 currencies, and 463 possible trades.

#### FTX

FTX has 413 currencies, and 819 possible exchanges.
However, some of the exchanges seem invalid (as in they are not exchanges at all).

For example:
BTC-PERP = Perpetual Futures
BTC-0325 = March 22 Futures
BTC-0624 = June 22 Futures

#### Crypto.com

Can access possible exchanges through the ticker.
However, the currencies aren't aways trading.
There are 283 exchenges returned by the API.
