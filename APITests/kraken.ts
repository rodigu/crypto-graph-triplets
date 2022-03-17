export type Asset = {
  aclass: string;
  altname: string;
  decimals: number;
  display_decimals: number;
};
export type AssetsMap = {
  [key: string]: Asset;
};

export type AssetPair = {
  altname: string;
  wsname: string;
  aclass_base: string;
  base: string;
  aclass_quote: string;
  quote: string;
  lot: string;
  pair_decimals: number;
  lot_decimals: number;
  lot_multiplier: number;
  leverage_buy: [];
  leverage_sell: [];
  fees: [][];
  fees_maker: [][];
  fee_volume_currency: string;
  margin_call: number;
  margin_stop: number;
  ordermin: string;
};
export type AssetPairsMap = {
  [key: string]: AssetPair;
};

export async function fetchAssetPairs(): Promise<AssetPairsMap> {
  const link = `https://api.kraken.com/0/public/AssetPairs`;
  const response = (await fetch(link)).json();
  const asset_pairs = (await response).result;
  return asset_pairs;
}

export async function fetchAssets(): Promise<AssetsMap> {
  const link = `https://api.kraken.com/0/public/Assets`;
  const response = (await fetch(link)).json();
  const assets = (await response).result;
  return assets;
}
