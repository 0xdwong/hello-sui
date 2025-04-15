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

async function main() {
  await findRouters();
}

main();
