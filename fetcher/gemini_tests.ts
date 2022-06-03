import * as g from "./gemini.ts";

const g_symbols = await g.fetchSymbols();
console.log(g_symbols.length);
const start_time = new Date().getTime();
const detail_list = await g.fetchDetailsList(g_symbols);
console.log(detail_list);
console.log(new Date().getTime() - start_time);
