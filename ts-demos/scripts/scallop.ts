import scallopApi from "../src/scallop";
import * as eventApi from "../src/events";

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
    "0xf91541a57d5dd90ff512610a767e002fcdb536784178b68c665bb1dbdf8f9323";
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

async function main() {
  // await getObligations();
  // await getMarket();
  // await getObligation();
  // await getLatestObligation();
  // await getUserPortfolio();
  // await getObligationAccount();
  await getLiquidityRiskLevel2();
  await getLiquidityRiskLevel();
}

main();
