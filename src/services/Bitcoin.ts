const bitcoin = require("bitcoinjs-lib");
const axios = require("axios");

const createAccount = () => {
  const keyPair = bitcoin.ECPair.makeRandom({
    network: bitcoin.networks.bitcoin,
  });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: bitcoin.networks.bitcoin,
  });
  return { address, privateKey: keyPair.toWIF() };
};

const transfer = async (sender: string, receiver: string, amount: number) => {
  // const txb = new bitcoin.TransactionBuilder(bitcoin.networks.bitcoin);
  // let txId = "mytxid"; // Transaction ID of the UTXO
  // let vout = 0; // Output index of the UTXO (could be 0, 1, 2, etc.)
  // let privateKey = bitcoin.ECPair.fromWIF(sender, bitcoin.networks.bitcoin);
  // txb.addInput(txId, vout);
  // txb.addOutput(receiver, amount);
  // txb.sign(0, privateKey);
  // let tx = txb.build().toHex();
  // console.log("Transaction:", tx);
  // axios
  //   .post("https://blockchain.info/pushtx", `tx=${tx}`)
  //   .then((response: any) => {
  //     console.log("Transaction broadcasted! TX ID:", response.data);
  //   })
  //   .catch((error: any) => {
  //     console.log("Error:", error);
  //   });
};

const checkBalance = async (data: any) => {
  const { address, privateKey } = data.wallet.bitcoin;
  try {
    const { balance, txids } = (
      await axios.get(
        `https://btc.getblock.io/988fc3f8-a9c6-4e32-a1b7-a1f91896d5b3/mainnet/blockbook/api/v2/address/${address}`
      )
    ).data;
    if (balance > 0) {
      console.log("BTC:", balance);
    }
  } catch (err) {
    console.log("BTC: " + err);
  }
};

export default { createAccount, transfer, checkBalance };
