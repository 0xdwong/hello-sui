const { getMidPrice } = require('./apis');
const { initDeepbookClient } = require('./client');

async function getSuiPrice() {
  const deepbookClient = initDeepbookClient('mainnet');
  const price = await getMidPrice('SUI_USDC', deepbookClient);
  console.log(price);
}

async function main() {
  await getSuiPrice();
}

main();
