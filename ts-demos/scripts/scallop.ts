import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import scallopApi from "../src/scallop";
import * as eventApi from "../src/events";
import config from "../src/config";
import dotenv from "dotenv";
import { getKeyPairByPrivateKey } from "../src/utils";
dotenv.config();

const suiClient = new SuiClient({
  url: getFullnodeUrl("mainnet"),
});

async function getObligations() {
  const obligations = await scallopApi.getObligations();
  console.log("==obligationsData==", obligations);
}

async function getMarket() {
  const market = await scallopApi.getMarket();
  console.log("==marketData==", market);
}

async function getObligation() {
  const obligationId =
    "0x19a1184f03b05692c7e4f973463ec5889fe3ce68dab8d4ae5c8bbd9c47e92adb";
  const obligation = await scallopApi.getObligation(obligationId);
  console.log("==obligationData==", JSON.stringify(obligation));
}

async function getLatestObligation() {
  const eventType =
    "0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::open_obligation::ObligationCreatedEvent";

  const events = await eventApi.getLatestEvents(eventType);

  for (const event of events) {
    const obligationId = (event.parsedJson as any).obligation;
    console.log("==obligationId==", obligationId);
    const obligation = await scallopApi.getObligation(obligationId);
    console.log("==obligation==", obligation);
  }
}

async function getUserPortfolio() {
  const userAddress =
    "0xa0b545efedd87007b833fe6b38b79ff811648e80337801e2a5e9f44e00455612";
  const userPortfolio = await scallopApi.getUserPortfolio(userAddress);
  console.log("==userPortfolio==", userPortfolio);
}

async function getObligationAccount() {
  const obligationId =
    "0xf91541a57d5dd90ff512610a767e002fcdb536784178b68c665bb1dbdf8f9323";
  const ownerAddress =
    "0x99efdeb464ba8cfabb29e52b4939bd70f16d08f9780fb875e196bfcb0c4a5b6f";

  const obligationAccount = await scallopApi.getObligationAccount(
    obligationId,
    ownerAddress
  );
  console.log("==obligationAccount==", obligationAccount);
}

async function getLiquidityRiskLevel() {
  const obligationId =
    "0xf91541a57d5dd90ff512610a767e002fcdb536784178b68c665bb1dbdf8f9323";
  const ownerAddress =
    "0x99efdeb464ba8cfabb29e52b4939bd70f16d08f9780fb875e196bfcb0c4a5b6f";

  console.time("getLiquidityRiskLevel");
  const riskLevel = await scallopApi.getLiquidityRiskLevel(
    obligationId,
    ownerAddress
  );
  console.timeEnd("getLiquidityRiskLevel");
  console.log("==riskLevel==", riskLevel);
}

async function getLiquidityRiskLevel2() {
  const obligationId =
    "0xf91541a57d5dd90ff512610a767e002fcdb536784178b68c665bb1dbdf8f9323";

  console.time("getLiquidityRiskLevel2");
  const riskLevel = await scallopApi.getObligationRiskLevel(obligationId);
  console.timeEnd("getLiquidityRiskLevel2");
  console.log("==riskLevel==", riskLevel);
}

async function liquidate() {
  const privateKey = process.env.SUI_PRIVATE_KEY!;
  const keypair = getKeyPairByPrivateKey(privateKey);

  const obligationId =
    "0xf91541a57d5dd90ff512610a767e002fcdb536784178b68c665bb1dbdf8f9323";

  // Debt type: USDC (what was borrowed)
  const debtCoinType = config.MAINNET.USDC_COIN_TYPE;
  // Collateral type: DEEP (what was collateralized)
  const collateralCoinType = config.MAINNET.DEEP_COIN_TYPE;
  const repayAmount = 1 * 10 ** 6; // 1 USDC (6 decimals)

  const params: scallopApi.LiquidateParams = {
    obligation: obligationId,
    debtCoinType,
    collateralCoinType,
    repayAmount,
  };

  const result = await scallopApi.liquidate(suiClient, keypair, params);
  console.log("==result==", result);
}

async function main() {
  // await getObligations();
  // await getMarket();
  await getObligation();
  // await getLatestObligation();
  // await getUserPortfolio();
  // await getObligationAccount();
  // await getLiquidityRiskLevel2();
  // await getLiquidityRiskLevel();

  // await liquidate();

  // await scallopApi.getAllAddresses();
}

main();
