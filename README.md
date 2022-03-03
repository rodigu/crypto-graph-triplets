- [REPL data analysis](#repl-data-analysis)
- [03/01](#0301)
- [03/03](#0303)

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
