import { ethers } from "ethers";

//Providers
export const eth_provider1 = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/2eb44c7cdad34e60a1fb78f156b7d175"
);
export const eth_provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/9a99e7ab7bde4c668b9b18df15cbe089"
);
export const bsc_provider = new ethers.providers.JsonRpcProvider(
  `https://bsc.getblock.io/${process.env.API_KEY_BSC}/mainnet/`
);
export const bsc_provider1 = new ethers.providers.JsonRpcProvider(
  `https://bsc.getblock.io/${process.env.API_KEY_BSC1}/mainnet/`
);
export const bsc_provider2 = new ethers.providers.JsonRpcProvider(
  `https://bsc.getblock.io/${process.env.API_KEY_BSC2}/mainnet/`
);
export const bsc_provider3 = new ethers.providers.JsonRpcProvider(
  `https://bsc.getblock.io/${process.env.API_KEY_BSC3}/mainnet/`
);
export const polygon_provider = new ethers.providers.JsonRpcProvider(
  `https://bsc.getblock.io/${process.env.API_KEY_POLYGON}/mainnet/`
);

//ContractABI
export const ERC20ABI = require("../utils/ContractABI/ERC20.json");
export const USDT_ABI = require("../utils/ContractABI/USDT.json");
export const USDC_ABI = require("../utils/ContractABI/USDC.json");

//ContractAddress
export const USDT_eth_contract = new ethers.Contract(
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  ERC20ABI,
  eth_provider
);
export const USDC_eth_contract = new ethers.Contract(
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  ERC20ABI,
  eth_provider
);
export const BNB_eth_contract = new ethers.Contract(
  "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  ERC20ABI,
  eth_provider1
);
export const MATIC_eth_contract = new ethers.Contract(
  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  ERC20ABI,
  eth_provider1
);

export const USDT_bsc_contract = new ethers.Contract(
  "0x55d398326f99059ff775485246999027b3197955",
  ERC20ABI,
  bsc_provider
);
export const USDC_bsc_contract = new ethers.Contract(
  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  ERC20ABI,
  bsc_provider1
);
export const ETH_bsc_contract = new ethers.Contract(
  "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
  ERC20ABI,
  bsc_provider1
);
export const MATIC_bsc_contract = new ethers.Contract(
  "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",
  ERC20ABI,
  bsc_provider2
);
export const ADA_bsc_contract = new ethers.Contract(
  "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",
  ERC20ABI,
  bsc_provider2
);
export const LTC_bsc_contract = new ethers.Contract(
  "0x4338665cbb7b2485a8855a139b75d5e34ab0db94",
  ERC20ABI,
  bsc_provider3
);
export const XRP_bsc_contract = new ethers.Contract(
  "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe",
  ERC20ABI,
  bsc_provider3
);

export const USDT_polygon_contract = new ethers.Contract(
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  ERC20ABI,
  polygon_provider
);
export const USDC_polygon_contract = new ethers.Contract(
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  ERC20ABI,
  polygon_provider
);

export const USDT_tron = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
export const USDC_tron = "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8";

export const USDT_solana = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
export const USDC_solana = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
