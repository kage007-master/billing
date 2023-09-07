import axios from "axios";

const delay = 60 * 1000;
const gasPrice = 1000000000;
const gasLimit = 50000;
const fee = 250000 * gasPrice;
const identifier = "EBONE-1148cd";
const chainID = "1";

const { Mnemonic, UserSigner } = require("@multiversx/sdk-wallet");
const {
  Address,
  GasEstimator,
  Transaction,
  TokenTransfer,
  TransferTransactionsFactory,
} = require("@multiversx/sdk-core");

const factory = new TransferTransactionsFactory(new GasEstimator());

const bip39 = require("bip39");

const { ApiNetworkProvider } = require("@multiversx/sdk-network-providers");
const apiNetworkProvider = new ApiNetworkProvider("https://api.multiversx.com");

let flags: any = {};

const createAccount = () => {
  const seed = bip39.generateMnemonic(256);
  const secret = Mnemonic.fromString(seed).deriveKey(0);
  return {
    address: secret.generatePublicKey().toAddress().bech32(),
    seed,
  };
};

async function broadcastTransaction(transaction: any) {
  const url = `https://api.multiversx.com/transactions`;
  const data = transaction.toSendable();
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const sendEGLD = async (sender: string, receiver: string, amount: number) => {
  const mnemonic = Mnemonic.fromString(sender);
  const userSecretKey = mnemonic.deriveKey(0);
  const userPublicKey = userSecretKey.generatePublicKey();
  const address = userPublicKey.toAddress();
  const signer = new UserSigner(userSecretKey);

  const { nonce } = await apiNetworkProvider.doGetGeneric(
    `accounts/${address}`
  );

  const transaction = new Transaction({
    nonce,
    value: TokenTransfer.egldFromBigInteger(amount),
    sender: address,
    receiver: new Address(receiver),
    gasPrice,
    gasLimit,
    chainID,
  });

  const serializedTransaction = transaction.serializeForSigning();
  const signature = await signer.sign(serializedTransaction);
  transaction.applySignature(signature);

  await broadcastTransaction(transaction);
};

const sendEBONE = async (sender: string, receiver: string, amount: number) => {
  const mnemonic = Mnemonic.fromString(sender);
  const userSecretKey = mnemonic.deriveKey(0);
  const userPublicKey = userSecretKey.generatePublicKey();
  const address = userPublicKey.toAddress();
  const signer = new UserSigner(userSecretKey);

  const transfer1 = TokenTransfer.fungibleFromAmount(identifier, amount, 6);

  const { nonce } = await apiNetworkProvider.doGetGeneric(
    `accounts/${address}`
  );

  const transaction = factory.createESDTTransfer({
    tokenTransfer: transfer1,
    nonce,
    sender: address,
    receiver: new Address(receiver),
    chainID,
  });

  const serializedTransaction = transaction.serializeForSigning();
  const signature = await signer.sign(serializedTransaction);
  transaction.applySignature(signature);

  await broadcastTransaction(transaction);
};

const checkBalance = async (data: any) => {
  const { address, seed } = data.wallet.mvx;
  try {
    if (flags[address] === true) return;
    const { balance: egld } = await apiNetworkProvider.doGetGeneric(
      `accounts/${address}`
    );
    if (egld > gasLimit * gasPrice) {
      if (egld > fee) {
        data.balance.egld += egld / 10 ** 18;
        data.save();
        console.log("EGLD:", egld / 10 ** 18);
      }
      flags[address] = true;
      await sendEGLD(
        seed,
        process.env.ADDRESS_MVX!,
        egld - gasLimit * gasPrice
      );
      setTimeout(() => (flags[address] = false), delay);
    }
    if (flags[address] === true) return;
    const res = (
      await apiNetworkProvider.doGetGeneric(`accounts/${address}/tokens`)
    ).find((item: any) => item.identifier === identifier);
    let ebone = 0;
    if (res) ebone = Number(res.balance);
    if (ebone > 0) {
      data.balance.ebone += ebone / 10 ** 6;
      data.save();
      console.log("EBONE:", ebone / 10 ** 6);
      flags[address] = true;
      await sendEGLD(process.env.SEED_MVX!, address, fee);
      setTimeout(async () => {
        try {
          await sendEBONE(seed, process.env.ADDRESS_MVX!, ebone / 10 ** 6);
        } catch (err) {
          console.log("MVX:", err);
        }
        setTimeout(() => (flags[address] = false), delay);
      }, delay);
    }
  } catch (err) {
    console.log("MVX:", new Date());
  }
};

export default { createAccount, sendEGLD, sendEBONE, checkBalance };
