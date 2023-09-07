import { Seed, WalletServer } from "cardano-wallet-js";
let walletServer = WalletServer.init("http://127.0.0.1:8090/v2");
let passphrase = "tangocrypto";
let name = "tangocrypto-wallet";

const createAccount = async () => {
  let recoveryPhrase = Seed.generateRecoveryPhrase();
  let mnemonic_sentence = Seed.toMnemonicList(recoveryPhrase);
  let wallet = await walletServer.createOrRestoreShelleyWallet(
    name,
    mnemonic_sentence,
    passphrase
  );
  let address = await wallet.getAddressAt(0);
  return { address: address.id, seed: recoveryPhrase, id: wallet.id };
};

const transfer = async () => {};

const checkBalance = async (data: any) => {
  const { address, seed } = data.wallet.cardano;
  let wallet = await walletServer.getShelleyWallet(
    "dc5b9c42acee4eb48c44cc4cd70e9afdcb1b751b"
  );
  // let wallet = await walletServer.createOrRestoreShelleyWallet(
  //   name,
  //   Seed.toMnemonicList(
  //     "coin vanish banana unusual smoke midnight toe hen globe acid coffee gown fine amused library"
  //   ),
  //   passphrase
  // );
  let availableBalance = wallet.getAvailableBalance();
  console.log("ADA:" + availableBalance);
};

export default { createAccount, transfer, checkBalance };
