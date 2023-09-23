import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import UserModel, { User } from "../models/User";
import environment from "../configs";
import walletController from "./wallet.controller";
const initAvatar =
  "https://upcdn.io/W142hJk/image/demo/4mTLJiq7Ke.png?w=600&h=600&fit=max&q=70";

const authController = {
  login: async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    try {
      const { address } = req.body;
      let user = await UserModel.findOne({ address });
      let isNew = false;
      if (!user) {
        const cnt = await UserModel.count();
        let wallet = await walletController.getNew();
        user = new UserModel({
          address,
          name: `ddog-${1000 + cnt}`,
          avatar: initAvatar,
          wallet,
        });
        isNew = true;
        await user.save();
      }
      const payload = {
        user: {
          address: user.address,
          name: user.name,
          role: user.role,
        },
      };
      jwt.sign(payload, environment.secretKey, (err, token) => {
        if (err) throw err;
        res.send({ token, user, isNew });
      });
    } catch (error: any) {
      return res.status(500).send({ msg: "Server Error", error });
    }
  },

  updateProfile: async (req: any, res: any) => {},

  users: async (req: any, res: any) => {
    const result: any = (await UserModel.find(
      {},
      {
        _id: 0,
        wallet: 0,
        role: 0,
        __v: 0,
        balance: {
          eth: 0,
          bnb: 0,
          ltc: 0,
          egld: 0,
          btc: 0,
          kas: 0,
          usdc: 0,
          usdt: 0,
          erg: 0,
          xrp: 0,
          matic: 0,
          sol: 0,
          ada: 0,
        },
      }
    )) as User[];
    res.send(result);
  },
};

export const authValidation = {
  login: [check("address", "Connect your wallet").not().isEmpty()],
  register: [
    check("address", "Connect your wallet").not().isEmpty(),
    check("name", "Name is required").not().isEmpty(),
    check("avatar", "Avatar is required").not().isEmpty(),
  ],
};

export default authController;
