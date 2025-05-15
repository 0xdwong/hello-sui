import { AggregatorClient } from "@cetusprotocol/aggregator-sdk";
import BN from "bn.js";

/**
 * Get price between two coin types
 * @param fromCoinType The source coin type
 * @param fromCoinDecimal The decimal of source coin
 * @param toCoinType The target coin type
 * @param toCoinDecimal The decimal of target coin
 * @returns The price as string or null if not available
 */
export async function getPrice(
  fromCoinType: string,
  fromCoinDecimal: number,
  toCoinType: string,
  toCoinDecimal: number
): Promise<string | null> {
  if (fromCoinDecimal < 0 || toCoinDecimal < 0) {
    throw new Error("decimal must be greater than or equal to 0");
  }

  const client = new AggregatorClient({});

  try {
    const amount = new BN(10).pow(new BN(9));

    const routers = await client.findRouters({
      from: fromCoinType,
      target: toCoinType,
      amount,
      byAmountIn: true, // true means fix input amount, false means fix output amount
    });

    if (!routers?.routes || routers.routes.length === 0) {
      console.log("No routes found");
      return null;
    }

    // Calculate weighted average price
    let totalAmountIn = new BN(0);
    let totalAmountOut = new BN(0);

    for (const route of routers.routes) {
      const { amountIn, amountOut } = route;
      totalAmountIn = totalAmountIn.add(amountIn);
      totalAmountOut = totalAmountOut.add(amountOut);
    }

    // Calculate average price by dividing total output by total input
    const precisionMultiplier = new BN(10).pow(new BN(18)); // 10^18 for better precision
    const fromCoinDecimalBN = new BN(10).pow(new BN(fromCoinDecimal));
    const toCoinDecimalBN = new BN(10).pow(new BN(toCoinDecimal));

    const avgPriceBN = totalAmountOut
      .mul(precisionMultiplier)
      .mul(fromCoinDecimalBN)
      .div(toCoinDecimalBN)
      .div(totalAmountIn);

    const avgPriceStr = (
      Number(avgPriceBN) / Number(precisionMultiplier)
    ).toFixed(12);

    return avgPriceStr;
  } catch (error) {
    console.error("Error getting price:", error);
    return null;
  }
}
