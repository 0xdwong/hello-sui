const { SuinsClient, SuinsTransaction } = require('@mysten/suins');
const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const { Transaction } = require('@mysten/sui/transactions');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const dotenv = require('dotenv');
dotenv.config();
const SUI_PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
const USDC_ADDRESS =
  '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';

async function lookupAddress(domain, network = 'mainnet') {
  const suinsClient = new SuinsClient({
    client: new SuiClient({ url: getFullnodeUrl(network) }),
    network,
  });

  const nameRecord = await suinsClient.getNameRecord(domain);

  if (!nameRecord) {
    console.log(`${domain} => not registered`);
    return;
  }

  if (!nameRecord.targetAddress) {
    console.log(`${domain} => registered but no target address`);
    return;
  }

  console.log(`${domain} => ${nameRecord.targetAddress}`);

  return nameRecord.targetAddress;
}

async function lookupDomain(address, network = 'mainnet') {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const resp = await suiClient.resolveNameServiceNames({
    address,
  });

  if (!resp.data.length) {
    console.log(`${address} => no domain associated`);
    return;
  }

  const domain = resp.data[0];

  console.log(`${address} => ${domain}`);

  return domain;
}

async function getPriceList(network = 'mainnet') {
  const suinsClient = new SuinsClient({
    client: new SuiClient({ url: getFullnodeUrl(network) }),
    network,
  });

  // Prices are in USDC MIST; 1 USDC = 1_000_000 MIST
  const priceList = await suinsClient.getPriceList();

  const priceListInUSDC = new Map();
  for (const [key, value] of priceList.entries()) {
    priceListInUSDC.set(key, value / 1_000_000);
  }
  console.log('Price list in USDC:\n', priceListInUSDC);

  return priceListInUSDC;
}

async function registerName(name, years, network = 'mainnet') {
  //step0: lookup address
  const address = await lookupAddress(name, network);
  if (address) {
    console.log(`${name} => already registered`);
    return;
  }

  // Step 1: Create a SuinsClient instance
  const suiClient = new SuiClient({
    url: getFullnodeUrl(network), // Sui testnet endpoint
  });
  const suinsClient = new SuinsClient({
    client: suiClient,
    network,
  });

  // Get keypair
  const keypair = Ed25519Keypair.fromSecretKey(SUI_PRIVATE_KEY);
  const senderAddress = keypair.toSuiAddress();
  console.log('keypair', senderAddress);

  /* Registration Example Using SUI */
  const tx = new Transaction();
  // Set the sender address
  tx.setSender(senderAddress);
  tx.setGasBudget(50000000);

  const suinsTx = new SuinsTransaction(suinsClient, tx);
  const maxPaymentAmount = 1 * 1_000_000_000; // In MIST of the payment coin type

  const [coin] = tx.splitCoins(tx.gas, [maxPaymentAmount]);

  const coinConfig = suinsClient.config.coins.SUI;

  // priceInfoObjectId is required for SUI/NS
  const priceInfoObjectId = (await suinsClient.getPriceInfoObject(tx, coinConfig.feed))[0];

  // Build the transaction to register the name, specifying a year from 1 to 5.
  const nft = suinsTx.register({
    domain: name,
    years: years,
    coinConfig,
    coin,
    priceInfoObjectId, // Only required for SUI/NS
  });

  tx.transferObjects([nft], senderAddress);

  // sign and execute the transaction
  const builtTx = await tx.build({ client: suiClient });
  const txnDigest = await suiClient.signAndExecuteTransaction({
    transaction: builtTx,
    signer: keypair,
    requestType: 'WaitForLocalExecution',
  });
  console.log(txnDigest);
}

async function registerNameUsingUSDC(name, years, network = 'mainnet') {
  //step0: lookup address
  const address = await lookupAddress(name, network);
  if (address) {
    console.log(`${name} => already registered`);
    return;
  }

  // Step 1: Create a SuinsClient instance
  const suiClient = new SuiClient({
    url: getFullnodeUrl(network), // Sui testnet endpoint
  });
  const suinsClient = new SuinsClient({
    client: suiClient,
    network,
  });

  // Get keypair
  const keypair = Ed25519Keypair.fromSecretKey(SUI_PRIVATE_KEY);
  const senderAddress = keypair.toSuiAddress();
  console.log('keypair', senderAddress);

  // 获取用户拥有的 USDC 代币对象
  const { data: coins } = await suiClient.getCoins({
    owner: senderAddress,
    coinType: USDC_ADDRESS,
  });

  if (!coins.length) {
    console.log(`No USDC coins found in address ${senderAddress}`);
    return;
  }
  const usdcCoin = coins[0];
  const usdcCoinObjectId = usdcCoin.coinObjectId;
  const usdcBalance = BigInt(usdcCoin.balance);
  const price = 10 * 1_000_000; // In MIST of the payment coin type
  if (usdcBalance < BigInt(price)) {
    console.log(`Insufficient USDC balance. Required: ${price}, Available: ${usdcBalance}`);
    return;
  }

  console.log(`Using USDC coin: ${usdcCoinObjectId}`);

  const tx = new Transaction();
  tx.setSender(senderAddress);
  tx.setGasBudget(50000000);
  const suinsTx = new SuinsTransaction(suinsClient, tx);
  const [coin] = tx.splitCoins(usdcCoinObjectId, [price]);

  const coinConfig = suinsClient.config.coins.USDC; // Specify the coin type used for the transaction
  const nft = suinsTx.register({
    domain: name,
    years: years,
    coinConfig,
    coin,
  });

  tx.transferObjects([nft], senderAddress);

  // sign and execute the transaction
  const builtTx = await tx.build({ client: suiClient });
  const txnDigest = await suiClient.signAndExecuteTransaction({
    transaction: builtTx,
    signer: keypair,
    requestType: 'WaitForLocalExecution',
  });
  console.log(txnDigest);
}

async function main() {
  // await lookupAddress('damien.sui');
  // await lookupDomain('0xb5f59df8059cccb0f4f9a55e8adf60f0bbc16180cb9ccf5d50e0c1c3e2bd4401');
  // await getPriceList('testnet');
  await registerName('demos.sui', 1, 'testnet');
  // await registerNameUsingUSDC('demos.sui', 1, 'mainnet');
}

main();
