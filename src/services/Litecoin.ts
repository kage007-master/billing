const bitcoin = require("bitcoinjs-lib");
const axios = require("axios");

const litecoin = {
  messagePrefix: "\x19Litecoin Signed Message:\n",
  bech32: "ltc",
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
};

const createAccount = () => {
  const keyPair = bitcoin.ECPair.makeRandom({
    network: litecoin,
  });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: litecoin,
  });
  return { address, privateKey: keyPair.toWIF() };
};

const transfer = async (
  sender: string,
  receiver: string,
  amount: number,
  txid: string
) => {
  const key = bitcoin.ECPair.fromWIF(sender, litecoin);
  const txb = new bitcoin.TransactionBuilder(litecoin);
  //  const psbt = new bitcoin.Psbt({ network: litecoin });

  txb.addInput(txid, 0);
  txb.addOutput(receiver, Number(amount));
  txb.sign(0, key);
  const rawTx = txb.build().toHex();
  // psbt.addInput({
  //   hash: txid,
  //   index: 0,
  //   nonWitnessUtxo: Buffer.from(rawTx, "hex"), // rawTransaction of the UTXO
  // });

  // psbt.addOutput({
  //   address: receiver,
  //   value: Number(amount),
  // });

  // psbt.signInput(0, key);
  // psbt.validateSignaturesOfInput(0);
  // psbt.finalizeAllInputs();

  // const rawTx1 = psbt.extractTransaction().toHex();
  console.log(rawTx);

  const response = await axios({
    method: "post",
    url: "https://api.blockcypher.com/v1/ltc/main/txs/push",
    headers: {},
    data: JSON.stringify({
      tx: rawTx,
    }),
  });
  console.log(response.data);
};

const checkBalance = async (data: any) => {
  const { address, privateKey } = data.wallet.litecoin;
  try {
    const response = await axios.get(
      `https://ltc.getblock.io/b8b542ca-5f4b-4d52-a6c0-9207b85e3603/mainnet/blockbook/api/v2/address/${address}`
    );
    const balanceInSatoshis = response.data.balance;
    if (balanceInSatoshis > 1000) {
      console.log("LTC:", balanceInSatoshis);
      // await transfer(
      //   privateKey,
      //   process.env.ADDRESS_LTC!,
      //   balanceInSatoshis,
      //   response.data.txids[0]
      // );
    }
  } catch (err) {
    console.log("LTC: " + err);
  }
};

export default { createAccount, transfer, checkBalance };
