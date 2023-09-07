import { USDT_tron, USDC_tron } from "../configs/const";

const TronWeb = require("tronweb");
const tronUrl = "https://api.trongrid.io";

const createAccount = async () => {
  const tronWeb = new TronWeb({ fullHost: tronUrl });
  let newAccount = await tronWeb.createAccount();
  return {
    address: tronWeb.address.fromPrivateKey(newAccount.privateKey),
    privateKey: newAccount.privateKey,
  };
};

const sendToken = async (
  sender: string,
  receiver: string,
  amount: number,
  pk: string,
  contract: string
) => {
  console.log(pk);

  const tronWeb = new TronWeb(tronUrl, tronUrl, tronUrl, pk);
  try {
    const { abi } = await tronWeb.trx.getContract(contract);
    const contr = tronWeb.contract(abi.entrys, contract);

    const resp = await contr.methods.transfer(receiver, 1000).send();
    console.log(resp);

    // const amountInSun = tronWeb.toSun(amount);
    // const Contract = await tronWeb.contract().at(contract);
    // const result = await Contract.transfer(receiver, amountInSun).send({
    //   feeLimit: 100000000,
    //   callValue: 0,
    //   shouldPollResponse: true,
    //   from: sender,
    // });
    // console.log("Transaction ID:", result.transaction.txID);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const transfer = async () => {};

const checkBalance = async (data: any) => {
  try {
    const { address, privateKey } = data.wallet.tron;
    const tronWeb = new TronWeb({ fullHost: tronUrl, privateKey });
    const balance = await tronWeb.trx.getBalance(address);
    let USDT_contract = await tronWeb.contract().at(USDT_tron);
    const usdt = await USDT_contract.balanceOf(address).call();
    // let USDC_contract = await tronWeb.contract().at(USDC_tron);
    // const usdc = await USDC_contract.balanceOf(address).call();
    if (balance > 30000000) {
      console.log("TRON:", balance, " USDT:", Number(usdt));
      // sendToken(
      //   address,
      //   process.env.ADDRESS_TRON!,
      //   usdt,
      //   privateKey,
      //   USDT_tron
      // );
    }
  } catch (err) {
    console.log("TRON:", err);
  }
};

export default { createAccount, transfer, checkBalance };
