import {
  USDT_eth_contract,
  USDC_eth_contract,
  BNB_eth_contract,
  MATIC_eth_contract,
  USDT_polygon_contract,
  USDC_polygon_contract,
  USDT_bsc_contract,
  USDC_bsc_contract,
  ETH_bsc_contract,
  MATIC_bsc_contract,
  ADA_bsc_contract,
  LTC_bsc_contract,
  XRP_bsc_contract,
  bsc_provider,
  eth_provider,
  polygon_provider,
} from "../configs/const";
import { ethers } from "ethers";

const createAccount = () => {
  const wallet = ethers.Wallet.createRandom();
  return { address: wallet.address, privateKey: wallet.privateKey };
};

const sendNativeToken = async (
  sender: string,
  receiver: string,
  amount: number,
  provider: any
) => {
  try {
    const wallet = new ethers.Wallet(sender, provider);
    const tx = { to: receiver, value: amount };
    await wallet.sendTransaction(tx);
  } catch (err) {
    console.log(err);
  }
};

const sendToken = async (
  sender: string,
  receiver: string,
  amount: number,
  contract: string,
  provider: any,
  abi: any
) => {
  try {
    const wallet = new ethers.Wallet(sender, provider);
    const Contract = new ethers.Contract(contract, abi, wallet);
    let tx = await Contract.transfer(receiver, amount);
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};

const transfer = async () => {};

const checkBalance = async (data: any) => {
  try {
    const { address, privateKey } = data.wallet.ether;
    const eth_balance = await eth_provider.getBalance(address);
    const balance1 = await USDT_eth_contract.balanceOf(address);
    const balance2 = await USDC_eth_contract.balanceOf(address);
    const balance3 = await MATIC_eth_contract.balanceOf(address);
    const balance4 = await BNB_eth_contract.balanceOf(address);
    if (eth_balance + balance1 + balance2 + balance3 + balance4 > 0)
      console.log(
        "ETH:",
        Number(eth_balance) / 10 ** 18,
        "USDT:",
        Number(balance1),
        "USDC:",
        Number(balance2),
        "MATIC:",
        Number(balance3),
        "BNB:",
        Number(balance4)
      );
    const bnb_balance = await bsc_provider.getBalance(address);
    const bsc1 = await USDT_bsc_contract.balanceOf(address);
    const bsc2 = await USDC_bsc_contract.balanceOf(address);
    const bsc3 = await ETH_bsc_contract.balanceOf(address);
    const bsc4 = await MATIC_bsc_contract.balanceOf(address);
    const bsc5 = await ADA_bsc_contract.balanceOf(address);
    const bsc6 = await LTC_bsc_contract.balanceOf(address);
    const bsc7 = await XRP_bsc_contract.balanceOf(address);
    if (bnb_balance + bsc1 + bsc2 + bsc3 + bsc4 + bsc5 + bsc6 + bsc7 > 0)
      console.log(
        "BNB:",
        Number(bnb_balance) / 10 ** 18,
        "USDT:",
        Number(bsc1),
        "USDC:",
        Number(bsc2),
        "ETH:",
        Number(bsc3),
        "MATIC:",
        Number(bsc4),
        "ADA:",
        Number(bsc5),
        "LTC:",
        Number(bsc6),
        "XRP:",
        Number(bsc7)
      );
    // const matic_balance = await polygon_provider.getBalance(address);
    // const matic1 = await USDT_polygon_contract.balanceOf(address);
    // const matic2 = await USDC_polygon_contract.balanceOf(address);
    // if (matic_balance + matic1 + matic2 > 0)
    //   console.log(
    //     "MATIC:",
    //     Number(matic_balance),
    //     "USDT:",
    //     Number(matic1),
    //     "USDC:",
    //     Number(matic2)
    //   );
  } catch (err) {
    console.log("EVM:", err);
  }
};

export default { createAccount, transfer, checkBalance };
