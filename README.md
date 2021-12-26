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
Code used in Jupyter to get image of network:
```python
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
import csv


def make_label_dict(labels):
    l = {}
    for i, label in enumerate(labels):
        l[i] = label
    return l

input_data = pd.read_csv('networkMatrix.csv', index_col=0)
G = nx.Graph(input_data.values)

with open('networkMatrix.csv', 'r') as f:
    d_reader = csv.DictReader(f)
    headers = d_reader.fieldnames

#print headers

labels=make_label_dict(headers)
#print labels

edge_labels = dict( ((u, v), d["weight"]) for u, v, d in G.edges(data=True) )
# pos = nx.kamada_kawai_layout(G)
pos = nx.spring_layout(G)
# options = {"edgecolors": "tab:gray", "node_size": 80, "alpha": 0.9}
# nx.draw_networkx_nodes(G, pos, node_color="tab:red", **options)
nx.draw_networkx_nodes(G, pos, node_size = 8, alpha = .8)
nx.draw_networkx_edges(G, pos, alpha = .8, width = .5)
plt.show()
```
This will yield:

![spring_layout](./img/spring_graph.png)

The nodes pushed away in the periphery are strong contenders for the independet set. It seems likely that is possible to easily turn the network into a split graph.

The following code will return the number of neighbors for any given currency:
```js
// list of currency neighbors, where CUR is the string code for a currency (ex. 'BTC')
let cur_n = data.exchangeList.filter(e=>e.base===CUR || e.quote===CUR)
// currencies that are not neighbors of CUR
data.currency.filter(c=>!cur_n.filter(n=>n.base===c||n.quote===c).length)
```
As of 12/23, BTC has 405 neighbors. These are the 79 currencies with no edges to BTC:
```
[
  "USDSB",   "BGBP",      "TUSDB",     "BULL",    "BEAR",
  "ETHBULL", "ETHBEAR",   "EOSBULL",   "EOSBEAR", "XRPBULL",
  "XRPBEAR", "BNBBULL",   "BNBBEAR",   "BTCUP",   "BTCDOWN",
  "IQ",      "ETHUP",     "ETHDOWN",   "ADAUP",   "ADADOWN",
  "LINKUP",  "LINKDOWN",  "VTHO",      "BNBUP",   "BNBDOWN",
  "XTZUP",   "XTZDOWN",   "EOSUP",     "EOSDOWN", "TRXUP",
  "TRXDOWN", "XRPUP",     "XRPDOWN",   "DOTUP",   "DOTDOWN",
  "SWRV",    "LTCUP",     "LTCDOWN",   "CREAM",   "BURGER",
  "SPARTA",  "UNIUP",     "UNIDOWN",   "SXPUP",   "SXPDOWN",
  "FILUP",   "FILDOWN",   "YFIUP",     "YFIDOWN", "BCHUP",
  "BCHDOWN", "KP3R",      "SLP",       "CVP",     "BCHA",
  "HEGIC",   "AAVEUP",    "AAVEDOWN",  "COVER",   "GHST",
  "SUSHIUP", "SUSHIDOWN", "XLMUP",     "XLMDOWN", "DF",
  "DEXE",    "BETH",      "PROS",      "UFT",     "BIFI",
  "PUNDIX",  "1INCHUP",   "1INCHDOWN", "SHIB",    "MASK",
  "ERN",     "XEC",       "RAY",       "BVND"
]
```
These might all be "special" currencies. BTCUP and BTCDOWN, for instance, are Binance's ["Leveraged Tokens"](https://www.binance.com/en/support/faq/360042957472).

12/25, one currency has been added to the list of BTC's non neighbors:
```js
> ext.getNonNeighbors(data,'BTC').length
80
> ext.getNonNeighbors(data,'BTC')
[
  "USDSB",   "BGBP",      "TUSDB",     "BULL",    "BEAR",
  "ETHBULL", "ETHBEAR",   "EOSBULL",   "EOSBEAR", "XRPBULL",
  "XRPBEAR", "BNBBULL",   "BNBBEAR",   "BTCUP",   "BTCDOWN",
  "IQ",      "ETHUP",     "ETHDOWN",   "ADAUP",   "ADADOWN",
  "LINKUP",  "LINKDOWN",  "VTHO",      "BNBUP",   "BNBDOWN",
  "XTZUP",   "XTZDOWN",   "EOSUP",     "EOSDOWN", "TRXUP",
  "TRXDOWN", "XRPUP",     "XRPDOWN",   "DOTUP",   "DOTDOWN",
  "SWRV",    "LTCUP",     "LTCDOWN",   "CREAM",   "BURGER",
  "SPARTA",  "UNIUP",     "UNIDOWN",   "SXPUP",   "SXPDOWN",
  "FILUP",   "FILDOWN",   "YFIUP",     "YFIDOWN", "BCHUP",
  "BCHDOWN", "KP3R",      "SLP",       "CVP",     "BCHA",
  "HEGIC",   "AAVEUP",    "AAVEDOWN",  "COVER",   "GHST",
  "SUSHIUP", "SUSHIDOWN", "XLMUP",     "XLMDOWN", "DF",
  "DEXE",    "BETH",      "PROS",      "UFT",     "BIFI",
  "PUNDIX",  "1INCHUP",   "1INCHDOWN", "SHIB",    "MASK",
  "ERN",     "XEC",       "RAY",       "OOKI",    "BVND"
]
> ext.getNeighbors(data,'OOKI')
[
  { symbol: "OOKIBUSD", base: "OOKI", quote: "BUSD", price: "0.04750000" },
  { symbol: "OOKIUSDT", base: "OOKI", quote: "USDT", price: "0.04748000" }
]
```
OOKI's only neighbors are BUSD and USDT.

### TODO
- [x] Show graph
- [x] Get all coins
- [ ] MaxClique algorithm
- check if nodes in other set are independent
- reference: https://www.geeksforgeeks.org/maximal-clique-problem-recursive-solution/
set of candidates for independent set if its not zero
- how many edges
- if there are many edges what
