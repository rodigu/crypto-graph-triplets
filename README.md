- [Use instructions](#use-instructions)
  - [History registration](#history-registration)
  - [Continuous loop](#continuous-loop)
  - [Python TimeSeries Object](#python-timeseries-object)
  - [REPL Analysis](#repl-analysis)
    - [Full setup](#full-setup)
    - [Step-by-step](#step-by-step)
    - [Supported fetchers](#supported-fetchers)
- [Meetings](#meetings)
  - [06/10](#0610)
    - [Topics](#topics)
    - [TODO](#todo)
  - [06/29](#0629)

The Python code for visualizing the network can be found in [the graphVis file](graphVis.py).

Graph data visualizations: https://colab.research.google.com/drive/1acU5-x7wnnEvgLnexv7ZuIzChGmbt71F?usp=sharing

## Use instructions

### History registration

To register historical data, run the file `register_history.ts` using deno:

```
deno run --allow-read --allow-net --allow-write register_history.ts FROM TIME DELAY FOLDER
```

Substitute the uppercase names with the following information:

- `FROM`: `us` or `com` (US or Chinese Binance data, respectively)
- `TIME`: how much time the data collection will run for in minutes
- `DELAY`: time in seconds between each data collection
- `FOLDER`: folder where history will be registered

Register history for 1440 minutes (24 hours), with a 30-second delay between each registration and writing it to the `./history_us/` folder:

```
deno run --allow-read --allow-net --allow-write register_history.ts us 1440 30 history_us
```

### Continuous loop

The file `looper.ts` will repeatedly display the top `NUM` triplets:

```
deno run --allow-net looper.ts FROM NUM
```

- `FROM`: `us` or `com` (US or Chinese Binance data, respectively)
- `NUM`: number of triplets to be displayed

Showing the top 10 triplets in the US Binance market:

```
deno run --allow-net looper.ts us 10
```

Showing the top 10 triplets in the world Binance market:

```
deno run --allow-net looper.ts com 10
```

### Python TimeSeries Object

You can use `read_history` to create a `JSON` file with a TimeSeries:

```
deno run --allow-read read_history.ts C1 C2 C3 PATH SHOWP
```

- `CN`: One of the three currencies in the triplet
- `PATH`: path for output file (defaults to `./`)
- `FROM`: file to draw data from
- `SHOWP`: show live progress (will slow process down), `1` for `true`, `0` for `false`

Creating a history JSON file for the triplet `USD,USDT,SPELL` and writing it to the folder `./triplet_history/` without showing the process' progress:

```
deno run --allow-read --allow-write read_history.ts USD UST BTC triplet_history history_02 1
```

Upload your file to the [`history_analysis.ipynb`](https://colab.research.google.com/drive/1xyZX4Gi8U42H3BpiDe1jkxFT48d5Civ0#scrollTo=DHHEC3z8Cz7a) Google Colab.
Use the `plotTripletHistory(filename)` function, giving the `FILE` name for the file you uploaded.

### REPL Analysis

#### Full setup

```ts
let fetch;
import("./fetcher/binance.ts").then((r) => (fetch = r));
let cycle;
import("./fetcher/profit_cycles.ts").then((r) => (cycle = r));
const from = "us";
const exchange_rates = await fetch.getExchangeRate(from);
const info = await fetch.getExchangeInfo(from);
const data = await fetch.getCompleteExchangeList(exchange_rates, info);
const network = fetch.getNetwork(data);
const tp_lst = cycles.tripletProfits(network);
tp_lst;
```

#### Step-by-step

Import the fetcher from the desired trading market as well as the cycle functions:

```ts
let fetch;
import("./fetcher/binance.ts").then((r) => (fetch = r));
let cycle;
import("./fetcher/profit_cycles.ts").then((r) => (cycle = r));
```

To create a network use:

```ts
// where the data will be extracted from
const from = "us";

// get exchange rates
const exchange_rates = await fetch.getExchangeRate(from);

// get list with trades and bases/quotes
const info = await fetch.getExchangeInfo(from);

// get parsed data
const data = await fetch.getCompleteExchangeList(exchange_rates, info);

// create network from data
const network = fetch.getNetwork(data);
```

To extract the triplets from the network:

```ts
// triplets with profits
const tp_lst = cycles.tripletProfits(network);
```

#### Supported fetchers

- Binance
- Coibase

## Meetings

### 06/10

#### Topics

- Binance Tests
  - Network is not actually bidirected
  - Ask and Bid prices are different
    - Ask and bid can be fetched from https://api.binance.com/api/v3/ticker/bookTicker
  - Top triplets include unknown currencies
    - harder to find someone willing to trade
    - greater discrepancy between ask and bid
    - going through the cycle changes edge weights if not done instantly
  - Human trading is too slow, proces would need to be automated
  - Only check on top 200 or so currencies might avoid problems

#### TODO

- [x] Change Colab formatting `format = "%Y-%m-%H-%d-%M-%S"`
- [ ] Amount that can be fulfilled at that price
  - [ ] Look at how much can flow into the cycle
  - [ ] How much can you move through the cycle
- [ ] Switch weight calculation to take buy and ask into account

### 06/29

- on tickerTriplets:

```ts
if (tick_map.get(vertices[index] + "" + pivot) === undefined) {
  edge_weight = +tick_map.get(pivot + "" + vertices[index])?.bidPrice!;
} else {
  edge_weight = 1 / +tick_map.get(vertices[index] + "" + pivot)?.askPrice!;
}
```
