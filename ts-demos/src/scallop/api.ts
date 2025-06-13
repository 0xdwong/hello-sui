import { Scallop } from "@scallop-io/sui-scallop-sdk";

const scallopSDK = new Scallop({
  networkType: "mainnet",
});

export async function getMarket() {
  await scallopSDK.init();
  const scallopQuery = await scallopSDK.createScallopQuery();
  const marketData = await scallopQuery.getMarketPools();
  return marketData;
}

export async function getObligations() {
  await scallopSDK.init();
  const scallopQuery = await scallopSDK.createScallopQuery();

  const obligationsData = await scallopQuery.getObligations();
  return obligationsData;
}

export async function getObligation(obligationId: string) {
  await scallopSDK.init();
  const scallopQuery = await scallopSDK.createScallopQuery();
  const obligationData = await scallopQuery.queryObligation(obligationId);
  return obligationData;
}

export async function getUserPortfolio(userAddress: string) {
  await scallopSDK.init();
  const scallopQuery = await scallopSDK.createScallopQuery();
  const userPortfolio = await scallopQuery.getUserPortfolio({
    walletAddress: userAddress,
  });
  return userPortfolio;
}

export async function getObligationAccount(
  obligationId: string,
  ownerAddress: string
) {
  await scallopSDK.init();
  const scallopQuery = await scallopSDK.createScallopQuery();
  const obligationAccount = await scallopQuery.getObligationAccount(
    obligationId,
    ownerAddress
  );
  return obligationAccount;
}

export async function getLiquidityRiskLevel(
  obligationId: string,
  ownerAddress: string
) {
  const obligationAccount = await getObligationAccount(
    obligationId,
    ownerAddress
  );
  return obligationAccount!.totalRiskLevel;
}
