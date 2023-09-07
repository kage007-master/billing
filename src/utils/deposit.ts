import UserModel, { User } from "../models/User";
import Cardano from "../services/Cardano";
import EVM from "../services/EVM";
import Solana from "../services/Solana";
import Ripple from "../services/Ripple";
import Tron from "../services/Tron";
import Bitcoin from "../services/Bitcoin";
import Litecoin from "../services/Litecoin";
import MVX from "../services/MVX";
import { TCoin } from "../utils/price";
import DepositModel from "../models/Deposit";
import { Fix } from "../utils";

export const startChecking = async () => {
  const result = (await UserModel.find()) as User[];
  for (let i = 0; i < result.length; i++) {
    await MVX.checkBalance(result[i]);
    // await Ripple.checkBalance(result[i]);
    // await Tron.checkBalance(result[i]);
    // await Bitcoin.checkBalance(result[i]);
    // await Litecoin.checkBalance(result[i]);
    // await EVM.checkBalance(result[i]);
    // await Solana.checkBalance(result[i]);
    // await Cardano.checkBalance(result[i]);
  }
  setTimeout(() => {
    startChecking();
  }, 5000);
};

export const startTron = async () => {
  // const result = (await UserModel.find()) as User[];
  // await Tron.checkBalance(result[2]);
  // setTimeout(startTron, 1000);
};

export const Deposit = async (params: any) => {
  const { address, name, network, chain, amount } = params;
  const user = (await UserModel.findOne({ address })) as User;
  const old: any = await DepositModel.findOne({ address, chain, network });
  if (old) {
    user.balance[chain as TCoin] = Fix(
      user.balance[chain as TCoin] + Number(amount) - Number(old.amount)
    );
    user.save();
    old.amount = amount;
    old.save();
  } else {
    user.balance[chain as TCoin] = Fix(
      user.balance[chain as TCoin] + Number(amount)
    );
    user.save();
    const data = new DepositModel({
      address,
      name,
      chain,
      network,
      amount,
    });
    data.save();
  }
};
