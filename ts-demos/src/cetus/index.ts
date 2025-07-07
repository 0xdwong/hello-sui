import { AggregatorClient } from "@cetusprotocol/aggregator-sdk";
import BN from "bn.js";
import {
  Transaction,
  TransactionArgument,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { CetusClmmSDK } from "@cetusprotocol/sui-clmm-sdk";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const CLOCK_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000006";

export class Cetus {
  private globalConfig: string;
  private partner: string;
  private suiClient: SuiClient;
  private aggregatorClient: AggregatorClient;
  private clmmSdk: CetusClmmSDK;

  constructor(suiClient?: SuiClient) {
    this.globalConfig =
      "0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f";

    // "0x0408fa4e4a4c03cc0de8f23d0c2bbfe8913d178713c9a271ed4080973fe42d8f";

    this.partner =
      "0x639b5e433da31739e800cd085f356e64cae222966d0f1b11bd9dc76b322ff58b";

    if (suiClient) {
      this.suiClient = suiClient;
    } else {
      this.suiClient = new SuiClient({
        url: getFullnodeUrl("mainnet"),
      });
    }

    this.aggregatorClient = new AggregatorClient({}); //todo

    this.clmmSdk = CetusClmmSDK.createSDK({ sui_client: this.suiClient });
  }
  /**
   * Get price between two coin types
   * @param fromCoinType The source coin type
   * @param fromCoinDecimal The decimal of source coin
   * @param toCoinType The target coin type
   * @param toCoinDecimal The decimal of target coin
   * @returns The price as string or null if not available
   */
  async getPrice(
    fromCoinType: string,
    fromCoinDecimal: number,
    toCoinType: string,
    toCoinDecimal: number
  ): Promise<string | null> {
    if (fromCoinDecimal < 0 || toCoinDecimal < 0) {
      throw new Error("decimal must be greater than or equal to 0");
    }

    try {
      const amount = new BN(10).pow(new BN(9));

      const routers = await this.aggregatorClient.findRouters({
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

  async getPoolId(fromCoinType: string, toCoinType: string) {
    let pools = await this.clmmSdk.Pool.getPoolByCoins([
      fromCoinType,
      toCoinType,
    ]);

    if (pools.length === 0) {
      throw new Error(
        `No pool found for ${fromCoinType} and ${toCoinType}, please check the coin type`
      );
    }

    pools = pools.sort((a, b) => {
      return Number(BigInt(b.liquidity) - BigInt(a.liquidity));
    });

    // use the pool with the max liquidity
    return pools[0].id;
  }

  // async swap(params: {
  //   fromCoinType: string;
  //   toCoinType: string;
  //   inputCoinId: string;
  //   keypair: Ed25519Keypair;
  // }) {
  //   const { fromCoinType, toCoinType, inputCoinId, keypair } = params;
  //   const sender = keypair.toSuiAddress();
  //   console.log("sender", sender);

  //   const txb = new Transaction();

  //   const poolId = await this.getPoolId(fromCoinType, toCoinType);

  //   const coinTypeA = toCoinType;
  //   const coinTypeB = fromCoinType;

  //   const args = [
  //     txb.object(this.globalConfig),
  //     txb.object(poolId),
  //     txb.object(this.partner),
  //     txb.object(inputCoinId),
  //     txb.object(CLOCK_ADDRESS),
  //   ];

  //   const publishedAt = this.aggregatorClient.publishedAtV2();

  //   txb.moveCall({
  //     target: `${publishedAt}::cetus::swap_b2a`,
  //     typeArguments: [coinTypeA, coinTypeB],
  //     arguments: args,
  //   }) as TransactionObjectArgument;

  //   const simulationRes = await this.suiClient.devInspectTransactionBlock({
  //     transactionBlock: txb,
  //     sender,
  //   });

  //   if (simulationRes.effects.status.status !== "success") {
  //     throw new Error(
  //       `DryRun swap failed: ${simulationRes.effects.status.error}`
  //     );
  //   }

  //   const executeRes = await this.suiClient.signAndExecuteTransaction({
  //     transaction: txb,
  //     signer: keypair,
  //   });

  //   if (executeRes.effects?.status.status !== "success") {
  //     throw new Error(
  //       `Execute swap failed: ${executeRes.effects?.status.error}`
  //     );
  //   }

  //   return executeRes.digest;
  // }

  async swapByCoin(
    txb: Transaction,
    params: {
      fromCoinType: string;
      toCoinType: string;
      inputCoin: TransactionObjectArgument;
    },
    keypair: Ed25519Keypair
  ) {
    const { fromCoinType, toCoinType, inputCoin } = params;
    const sender = keypair.toSuiAddress();

    const poolId = await this.getPoolId(fromCoinType, toCoinType);

    const coinTypeA = toCoinType;
    const coinTypeB = fromCoinType;

    const args = [
      txb.object(this.globalConfig),
      txb.object(poolId),
      txb.object(this.partner),
      inputCoin,
      txb.object(CLOCK_ADDRESS),
    ];

    const publishedAt = this.aggregatorClient.publishedAtV2();

    const receieveCoin = txb.moveCall({
      target: `${publishedAt}::cetus::swap_b2a`,
      typeArguments: [coinTypeA, coinTypeB],
      arguments: args,
    }) as TransactionObjectArgument;

    txb.transferObjects([receieveCoin], sender);

    const simulationRes = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: txb,
      sender,
    });

    if (simulationRes.effects.status.status !== "success") {
      throw new Error(
        `DryRun swap failed: ${simulationRes.effects.status.error}`
      );
    }

    const executeRes = await this.suiClient.signAndExecuteTransaction({
      transaction: txb,
      signer: keypair,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });

    if (executeRes.effects?.status.status !== "success") {
      throw new Error(
        `Execute swap failed: ${executeRes.effects?.status.error}`
      );
    }

    return executeRes.digest;
  }
}
