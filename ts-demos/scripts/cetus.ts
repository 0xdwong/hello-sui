import dotenv from "dotenv";
dotenv.config();
import { Cetus } from "../src/cetus";
import config from "../src/config";
import { getKeypairFromPrivateKey } from "../src/utils/keypair";
import { Transaction } from "@mysten/sui/transactions";

async function getPoolId() {
  const cetus = new Cetus();

  const coinTypeA = "0x2::sui::SUI";
  const coinTypeB = config.MAINNET.USDC_COIN_TYPE;

  const poolId = await cetus.getPoolId(coinTypeA, coinTypeB);

  console.log("poolId", poolId);
}

async function swapByCoin() {
  const cetus = new Cetus();

  const privateKey = process.env.SUI_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("SUI_PRIVATE_KEY is not set");
  }
  const keypair = getKeypairFromPrivateKey(privateKey);

  // hasui -> usdc
  const fromCoinType = config.MAINNET.HASUI_COIN_TYPE;
  const toCoinType = config.MAINNET.USDC_COIN_TYPE;

  // 0x2::coin::Coin<0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI>
  const inputCoinObjectId =
    "0xe37e8a58af66998dbed2fa1af86c89802be28e3233ccd135b378b4519dbb9ee9";

  const txb = new Transaction();
  txb.setGasBudget(100000000);
  const inputCoin = txb.object(inputCoinObjectId);

  const resp = await cetus.swapByCoin(
    txb,
    {
      fromCoinType,
      toCoinType,
      inputCoin,
    },
    keypair
  );

  console.log(resp);
}

async function main() {
  //   await getPoolId();

  await swapByCoin();
}

main();
