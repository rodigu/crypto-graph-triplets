1. [Deno Use](#deno-use)
2. [Binance Api Use](#binance-api-use)
3. [Other References](#other-references)
4. [Notes](#notes)
5. [Questions](#questions)

### Deno usage
To import modules from the Deno REPL, use:
```ts
let api; import("./req.ts").then(r => api = r);
```
When getting the output of `getExchangeRate` remember to use `await`:
```ts
const data:object = await api.getExchangeRate(currency);
```

### Binance API Use
Reference [Binance documentation](https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#symbol-price-ticker).
Use symbol price ticker.
The rate limit is 10 requests per second.

### Other References
Deno [write and read text file](https://medium.com/deno-the-complete-reference/read-write-json-files-in-deno-ca23073c4d76)
[Import into Deno REPL](https://stackoverflow.com/questions/63402664/how-to-import-a-module-inside-the-deno-repl)

### Notes
The binance API does not seem to have a rime or reason for the order of currency pairings.
It makes sense, for instance, to only provide `ETHBTC` but not `BTCETH`, what I don't know is why one is chosen in favor of the other.
Initially, we will be exploring the shape of the graph. Since our graphs will have no singletons, we don't need a set for vertices. All the information necessary for exploration will be in the set of edges.
Any useful graph we make will most likely be connected.

### Questions
*What percentage of trades do we expect to be profitable?*

*What should be the selection criteria for the vertices in the graph?*
- Get a graph A from the neighborhood of a big currency such as BTC, then create a graph from the neighborhood of A.
