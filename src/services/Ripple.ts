const keypairs = require("ripple-keypairs");
const { xrpToDrops, Client, Wallet } = require("xrpl");
const client = new Client("wss://xrplcluster.com");
client.connect();

const createAccount = () => {
  const keypair = keypairs.generateSeed();
  return {
    address: keypairs.deriveAddress(keypairs.deriveKeypair(keypair).publicKey),
    secretKey: keypair,
  };
};

const transfer = async (
  sender: string,
  secretKey: string,
  receiver: string,
  amount: string
) => {
  const vli = await client.getLedgerIndex();
  const wallet = Wallet.fromSeed(secretKey);
  const prepared = await client.autofill({
    TransactionType: "Payment",
    Account: sender,
    Amount: xrpToDrops(amount),
    Destination: receiver,
    LastLedgerSequence: vli + 75,
  });
  const signed = wallet.sign(prepared);
  try {
    await client.submit(signed.tx_blob);
  } catch (err) {
    console.log("err");
  }
};

const checkBalance = async (data: any) => {
  const { address, secretKey } = data.wallet.ripple;
  try {
    const standby_balance = await client.getXrpBalance(address);
    if (standby_balance > 10.1) {
      transfer(
        address,
        secretKey,
        process.env.ADDRESS_XRP!,
        (standby_balance - 10).toFixed(6)
      );
      data.balance.xrp += standby_balance - 10;
      data.save();
    }
  } catch (err) {
    console.log("XRP:", "Account not Found");
  }
};

export default { createAccount, transfer, checkBalance };
