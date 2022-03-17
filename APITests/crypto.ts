export async function ticker() {
  const link = `https://uat-api.3ona.co/v2/public/get-ticker`;

  const response = (await fetch(link)).json();
  const markets = (await response).result;
  return markets;
}

const t = await ticker();
await t;
const bu = t.data.find((c: any) => c.i == "BTC_USDT");
console.log(bu, t.data.length);
