import deepbookApi from "../src/deepbook";
import { SuiClient } from "@mysten/sui/client";
import { getKeyPairByPrivateKey } from "../src/utils";
import dotenv from "dotenv";
dotenv.config();

async function createUserBalanceManager() {
  const suiClient = new SuiClient({
    url: "https://fullnode.mainnet.sui.io:443",
  });
  const SUI_PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
  if (!SUI_PRIVATE_KEY) throw new Error("SUI_PRIVATE_KEY is not set");

  const keypair = getKeyPairByPrivateKey(SUI_PRIVATE_KEY);

  const balanceManagerId = await deepbookApi.createBalanceManager(
    suiClient,
    keypair
  );
  console.log("====balanceManagerId====:", balanceManagerId);
}

async function main() {
  await createUserBalanceManager();
}

main();
