const { AggregatorClient } = require('@cetusprotocol/aggregator-sdk');
const BN = require('bn.js');
const assert = require('assert');

function initAggregatorClient() {
  const endpoint = 'https://api-sui.cetus.zone/router_v2/find_routes';
  const client = new AggregatorClient(endpoint);
  return client;
}

async function findRouters({ from, target, amount, byAmountIn = true }) {
  const client = initAggregatorClient();

  const routers = await client.findRouters({
    from,
    target,
    amount,
    byAmountIn, // true means fix input amount, false means fix output amount
  });

  return routers;
}

async function getPrice(fromCoinType, fromCoinDecimal, toCoinType, toCoinDecimal) {
  assert(fromCoinDecimal >= 0 && toCoinDecimal >= 0, 'decimal must be greater than 0');

  const client = initAggregatorClient();

  try {
    const amount = new BN(10).pow(new BN(9));

    const routers = await client.findRouters({
      from: fromCoinType,
      target: toCoinType,
      amount,
      byAmountIn: true, // true means fix input amount, false means fix output amount
    });

    if (!routers?.routes || routers.routes.length === 0) {
      console.log('No routes found');
      return null;
    }

    // Calculate weighted average price
    let totalAmountIn = new BN(0);
    let totalAmountOut = new BN(0);

    for (let route of routers.routes) {
      const { amountIn, amountOut, initialPrice } = route;
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

    const avgPriceStr = (parseFloat(avgPriceBN) / parseFloat(precisionMultiplier)).toFixed(12);

    return avgPriceStr;
  } catch (error) {
    console.error('Error getting price:', error);
    return null;
  }
}

module.exports = {
  findRouters,
  getPrice,
};
