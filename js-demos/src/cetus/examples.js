const aggregator = require('./aggregator');
const BN = require('bn.js');
const config = require('../config');

async function findRouters() {
  const amount = new BN(1000000);
  const from = config.MAINNET.SUI_COIN_TYPE;
  const target = config.MAINNET.USDC_COIN_TYPE;

  const routers = await aggregator.findRouters({
    from,
    target,
    amount,
    byAmountIn: true, // true means fix input amount, false means fix output amount
  });

  console.log(routers);
}

async function getPrice() {
  const fromCoinType =
    '0x32a976482bf4154961bf20bfa3567a80122fdf8e8f8b28d752b609d8640f7846::miu::MIU';
  const fromCoinDecimal = 3;

  const toCoinType = config.MAINNET.USDC_COIN_TYPE;
  const toCoinDecimal = 6;

  const price = await aggregator.getPrice(fromCoinType, fromCoinDecimal, toCoinType, toCoinDecimal);
  console.log(price);
}

async function main() {
  // await findRouters();

  await getPrice();
}

main();
