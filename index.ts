import http from "http";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

import router from "./src/routes";
import { connectDatabase } from "./src/configs/db";
import { startChecking, startTron } from "./src/utils/deposit";

const Moralis = require("moralis").default;

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY1!,
});

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = new http.Server(app);
app.use("/", router);
connectDatabase();

setTimeout(() => {
  startChecking();
  startTron();
}, 10000);

const port = process.env.PORT || 4001;
httpServer.listen(port, () => console.log(`Server started on ${port}`));
