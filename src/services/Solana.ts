import { USDC_solana, USDT_solana } from "../configs/const";
const axios = require("axios");
const Moralis = require("moralis").default;
const { SolNetwork } = require("@moralisweb3/common-sol-utils");

let count = 0;
const solanaWeb3 = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const bs58 = require("bs58");
const connection = new solanaWeb3.Connection(
  "https://api.mainnet-beta.solana.com"
);

const createAccount = () => {
  const keypair = solanaWeb3.Keypair.generate();
  return {
    address: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
  };
};

const sendSOL = async (sender: string, receiver: string, amount: number) => {
  const senderKey = solanaWeb3.Keypair.fromSecretKey(bs58.decode(sender));
  const receiverKey = new solanaWeb3.PublicKey(receiver);
  const amountToSend = solanaWeb3.LAMPORTS_PER_SOL * amount;
  let transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: senderKey.publicKey,
      toPubkey: receiverKey,
      lamports: amountToSend,
    })
  );
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  transaction.setSigners(senderKey.publicKey);
  transaction.partialSign(senderKey);
  await connection.sendTransaction(transaction, senderKey);
};

const sendToken = async (
  sender: string,
  receiver: string,
  amount: number,
  mint: string
) => {
  const senderKey = solanaWeb3.Keypair.fromSecretKey(bs58.decode(sender));
  const receiverKey = new solanaWeb3.PublicKey(receiver);
  const mintPublicKey = new solanaWeb3.PublicKey(mint);
  const token = new splToken.Token(
    connection,
    mintPublicKey,
    splToken.TOKEN_PROGRAM_ID,
    senderKey
  );
  const sourceTokenAddress = await token.getOrCreateAssociatedAccountInfo(
    senderKey.publicKey
  );
  let transaction = new solanaWeb3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      sourceTokenAddress.address,
      receiverKey,
      senderKey.publicKey,
      [],
      amount
    )
  );
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  transaction.setSigners(senderKey.publicKey);
  transaction.partialSign(senderKey);
  await connection.sendTransaction(transaction, senderKey);
};

const transfer = async () => {};

const checkBalance = async (data: any) => {
  try {
    count++;
    const { address, privateKey } = data.wallet.solana;
    const balance = (
      await Moralis.SolApi.account.getBalance({
        address,
        network: SolNetwork.MAINNET,
      })
    ).toJSON().solana;
    const tokenbalances = (
      await Moralis.SolApi.account.getSPL({
        address,
        network: SolNetwork.MAINNET,
      })
    )
      .toJSON()
      .filter(
        (token: any) => token.mint === USDT_solana || token.mint === USDC_solana
      )
      .map((token: any) => {
        return { name: token.symbol, value: token.amountRaw };
      });
    if (Number(balance) + tokenbalances.length > 0)
      console.log("SOL:", balance, tokenbalances);
  } catch (err) {
    console.log("Sol:", err);
  }
};

export default { createAccount, transfer, checkBalance };
