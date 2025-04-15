const { AggregatorClient } = require('@cetusprotocol/aggregator-sdk');

async function findRouters({ from, target, amount, byAmountIn = true }) {
  const endpoint = 'https://api-sui.cetus.zone/router_v2/find_routes';
  const client = new AggregatorClient(endpoint);
  const routers = await client.findRouters({
    from,
    target,
    amount,
    byAmountIn, // true means fix input amount, false means fix output amount
  });

  return routers;
}

module.exports = {
  findRouters,
};
