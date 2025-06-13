import { Scallop } from "@scallop-io/sui-scallop-sdk";
import BigNumber from "bignumber.js";

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

export const getObligationRiskLevel = async (
  obligation: string,
  indexer: boolean = false
) => {
  await scallopSDK.init();
  const scallopQuery = await scallopSDK.createScallopQuery();
  
  const market = await scallopQuery.getMarketPools(undefined, { indexer });
  const coinPrices = await scallopQuery.getAllCoinPrices({
    marketPools: market.pools,
  });

  const obligationQuery = await scallopQuery.queryObligation(obligation);

  let totalRequiredCollateralValue = BigNumber(0);
  let totalBorrowedValueWithWeight = BigNumber(0);

  // Calculate total required collateral value from collaterals
  for (const assetCoinName of Array.from(
    scallopQuery.constants.whitelist.collateral
  )) {
    const collateral = obligationQuery?.collaterals.find((collateral) => {
      const collateralCoinName = scallopQuery.utils.parseCoinNameFromType(
        collateral.type.name
      );
      return assetCoinName === collateralCoinName;
    });

    const marketCollateral = market.collaterals[assetCoinName];
    const coinDecimal = scallopQuery.utils.getCoinDecimal(assetCoinName);
    const coinPrice = coinPrices?.[assetCoinName];

    if (marketCollateral && coinPrice) {
      const depositedAmount = BigNumber(collateral?.amount ?? 0);
      const depositedCoin = depositedAmount.shiftedBy(-1 * coinDecimal);
      const depositedValue = depositedCoin.multipliedBy(coinPrice);
      const requiredCollateralValue = depositedValue.multipliedBy(
        marketCollateral.liquidationFactor
      );

      totalRequiredCollateralValue = totalRequiredCollateralValue.plus(
        requiredCollateralValue
      );
    }
  }

  // Calculate total borrowed value with weight from debts
  const borrowAssetCoinNames: string[] = [
    ...new Set([
      ...Object.values(market.pools)
        .filter((t) => !!t)
        .map((pool) => pool.coinName),
    ]),
  ];

  for (const assetCoinName of borrowAssetCoinNames) {
    const debt = obligationQuery?.debts.find((debt) => {
      const poolCoinName = scallopQuery.utils.parseCoinNameFromType(
        debt.type.name
      );
      return assetCoinName === poolCoinName;
    });

    const marketPool = market.pools[assetCoinName];
    const coinDecimal = scallopQuery.utils.getCoinDecimal(assetCoinName);
    const coinPrice = coinPrices?.[assetCoinName];

    if (marketPool && coinPrice) {
      const increasedRate = debt?.borrowIndex
        ? marketPool.borrowIndex / Number(debt.borrowIndex) - 1
        : 0;
      const borrowedAmount = BigNumber(debt?.amount ?? 0).multipliedBy(
        increasedRate + 1
      );
      const borrowedCoin = borrowedAmount.shiftedBy(-1 * coinDecimal);
      const borrowedValue = borrowedCoin.multipliedBy(coinPrice);
      const borrowedValueWithWeight = borrowedValue.multipliedBy(
        marketPool.borrowWeight
      );

      totalBorrowedValueWithWeight = totalBorrowedValueWithWeight.plus(
        borrowedValueWithWeight
      );
    }
  }

  // Calculate risk level
  let riskLevel = totalRequiredCollateralValue.isZero()
    ? // Note: when there is no collateral and debt is not zero, then it's a bad-debt situation.
      totalBorrowedValueWithWeight.isGreaterThan(0)
      ? BigNumber(1)
      : BigNumber(0)
    : totalBorrowedValueWithWeight.dividedBy(totalRequiredCollateralValue);
  // Note: 100% represents the safety upper limit. Even if it exceeds 100% before it is liquidated, it will only display 100%.
  riskLevel = riskLevel.isLessThan(1) ? riskLevel : BigNumber(1);

  return riskLevel.toNumber();
};
