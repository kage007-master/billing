import axios from "axios";

export type TCoin =
  | "btc"
  | "eth"
  | "ltc"
  | "egld"
  | "kas"
  | "erg"
  | "xrp"
  | "bnb"
  | "usdc"
  | "usdt"
  | "matic"
  | "ada"
  | "sol"
  | "ebone"
  | "betabone";

export const getPrices = async () => {
  const prices = (
    await axios.get(
      'https://api.binance.com/api/v3/ticker/price?symbols=["USDCUSDT","BTCUSDT","ETHUSDT","BNBUSDT","LTCUSDT","ADAUSDT","XRPUSDT","MATICUSDT","SOLUSDT","EGLDUSDT"]'
    )
  ).data;

  let result: Record<TCoin, number> = {
    btc: 0,
    eth: 0,
    ltc: 0,
    egld: 0,
    kas: 0,
    erg: 0,
    xrp: 0,
    bnb: 0,
    usdc: 0,
    usdt: 1,
    matic: 0,
    ada: 0,
    sol: 0,
    ebone: 1,
    betabone: 1,
  };
  prices.map((price: any) => {
    const coin = price.symbol.slice(0, -4).toLowerCase();
    result[coin as TCoin] = Number(price.price);
  });
  return result;
};
