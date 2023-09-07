import Cardano from "../services/Cardano";
import EVM from "../services/EVM";
import Solana from "../services/Solana";
import Ripple from "../services/Ripple";
import Tron from "../services/Tron";
import Bitcoin from "../services/Bitcoin";
import Litecoin from "../services/Litecoin";
import MVX from "../services/MVX";
import { getPrices, TCoin } from "../utils/price";
import WithdrawModel from "../models/Withdraw";
import SwapModel from "../models/Swap";
import DepositModel from "../models/Deposit";
import UserModel, { User } from "../models/User";
import { Fix } from "../utils";

const walletController = {
  getNew: async () => {
    const evm = EVM.createAccount();
    const result = {
      // cardano: await Cardano.createAccount(),
      mvx: MVX.createAccount(),
      solana: Solana.createAccount(),
      tron: await Tron.createAccount(),
      ether: evm,
      bsc: evm,
      polygon: evm,
      bitcoin: Bitcoin.createAccount(),
      litecoin: Litecoin.createAccount(),
      ripple: Ripple.createAccount(),
    };
    return result;
  },
  getPrices: async (req: any, res: any) => {
    res.send(await getPrices());
  },
  withdraw: async (req: any, res: any) => {
    try {
      const { address, name, chain, network, amount, to } = req.body;
      if (req.user.user.address != address) {
        res.status(400).send({ result: "Failed!" });
        return;
      }
      const user = (await UserModel.findOne({ address })) as User;
      if (user.balance[chain as TCoin] >= amount && amount > 0) {
        user.balance[chain as TCoin] = Fix(
          user.balance[chain as TCoin] - Number(amount)
        );
        user.save();
        const data = new WithdrawModel({
          address,
          name,
          chain,
          network,
          amount,
          to,
          status: false,
        });
        data.save();
        console.log("Withdraw Request:", data);
        if (network === "mvx") {
          if (chain === "ebone")
            await MVX.sendEBONE(process.env.SEED_MVX!, to, amount);
          if (chain === "egld")
            await MVX.sendEGLD(
              process.env.SEED_MVX!,
              to,
              Number(amount) * 10 ** 18
            );
        }
        res.status(200).send({ result: "Success!" });
        return;
      }
      res.status(400).send({ result: "Failed!" });
    } catch (err) {
      res.status(400).send({ result: "Failed!" });
    }
  },
  swap: async (req: any, res: any) => {
    try {
      const { address, name, from, amount, to } = req.body;
      if (req.user.user.address != address) {
        res.status(400).send({ result: "Failed!" });
        return;
      }
      const user = (await UserModel.findOne({ address })) as User;
      if (user.balance[from as TCoin] >= amount && amount > 0) {
        const prices = await getPrices();
        const amount2 =
          (amount * prices[from as TCoin] * (to === "ebone" ? 1 : 0.99)) /
          prices[to as TCoin];
        user.balance[from as TCoin] = Fix(
          user.balance[from as TCoin] - Number(amount)
        );
        user.balance[to as TCoin] = Fix(user.balance[to as TCoin] + amount2);
        user.save();
        const data = new SwapModel({
          address,
          name,
          from,
          amount1: amount,
          amount2,
          to,
          status: false,
        });
        data.save();
        res.status(200).send({ result: "Success!", amount: amount2 });
        return;
      }
      res.status(400).send({ result: "Failed!" });
    } catch (err) {
      console.log("Swap:", err);
    }
  },
  deposit: async (req: any, res: any) => {
    const { address, name, network, chain, amount } = req.body;
    const user = (await UserModel.findOne({ address })) as User;
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
    res.status(200).send({ result: "Success!" });
  },
};

export default walletController;
