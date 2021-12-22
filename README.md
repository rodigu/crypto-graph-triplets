1. [Deno Use](#deno-use)
2. [Binance Api Use](#binance-api-use)
3. [Other References](#other-references)
4. [Notes](#notes)
5. [Questions](#questions)
6. [Analysis](#analysis)

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
Not all currencies have three letter abbreviations.
#### What is a bi-directional graph?
Cryptocurrency exchange networks are bi-directional graphs because if you can trade currency A by B, you can also trade B by A.
Say the weight of the vertice that connects A and B in the direction A to B is given by ![weight_formula](https://render.githubusercontent.com/render/math?math=w(A,B)). The weight of the same vertice going from B to A would be ![weight_formula](https://render.githubusercontent.com/render/math?math=w(B,A)=f(w(A,B))).

### Questions
*What percentage of trades do we expect to be profitable?*

*What should be the selection criteria for the vertices in the graph?*
- Get a graph A from the neighborhood of a big currency such as BTC, then create a graph from the neighborhood of A.

### Analysis
BTC has 399 neighbors:
![Teminal Screenshot of BTC Neighbors](./img/neighborsBTC.png)

### TODO
Show graph
Get all coins
MaxClique algorithm
- check if nodes in other set are independent
- reference: https://www.geeksforgeeks.org/maximal-clique-problem-recursive-solution/
set of candidates for independent set if its not zero
- how many edges
- if there are many edges what
