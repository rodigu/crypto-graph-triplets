export interface Market {
  baseCurrency: string;
  quoteCurrency: string;
  price: number;
}

export type RawMarket = {
  name: string;
  enabled: boolean;
  postOnly: boolean;
  priceIncrement: number;
  sizeIncrement: number;
  minProvideSize: number;
  last: number;
  bid: number;
  ask: number;
  price: number;
  type: string;
  baseCurrency: string | null;
  quoteCurrency: string | null;
  underlying: string | null;
  restricted: boolean;
  highLeverageFeeExempt: boolean;
  largeOrderThreshold: number;
  change1h: number;
  change24h: number;
  changeBod: number;
  quoteVolume24h: number;
  volumeUsd24h: number;
};

export async function fetchMarkets(): Promise<RawMarket[]> {
  const link = `https://ftx.com/api/markets`;

  const response = (await fetch(link)).json();
  const markets = (await response).result;
  return markets;
}
