import express from "express";
import authController, { authValidation } from "../controllers/auth.controller";
import walletController from "../controllers/wallet.controller";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.post("/auth/login", authValidation.login, authController.login); // address
router.post(
  "/auth/profile",
  authValidation.profile,
  authController.updateProfile
);
router.get("/auth/users", authController.users);

router.get("/prices", walletController.getPrices);
router.post("/withdraw", authMiddleware, walletController.withdraw);
router.post("/swap", authMiddleware, walletController.swap);
router.post("/deposit", walletController.deposit);

export default router;
