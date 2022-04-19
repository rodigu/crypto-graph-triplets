// To run with Deno REPL:
// deno run --allow-write --allow-net update_data.ts
// Add --reload if there are updates to 3rd party packages

import * as api from "./req.ts";
import * as ext from "./extraFunctions.ts";

const exchange_rates = await api.getExchangeRate();

const info = await api.getExchangeInfo();

const data = ext.getCompleteExchangeList(exchange_rates, info);

await ext.writeNetworkMatrixCSV(
  data.exchange_list,
  data.currencies,
  "newAdjacencyM.csv"
);

await ext.writeExchangeList(data.exchange_list);
await ext.writeCurrencyList(data.currencies);
