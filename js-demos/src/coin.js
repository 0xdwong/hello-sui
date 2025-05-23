const { SuinsClient, SuinsTransaction } = require('@mysten/suins');
const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const { Transaction } = require('@mysten/sui/transactions');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const config = require('./config');
const dotenv = require('dotenv');
dotenv.config();

async function getCoins(address, coinType = '', network = 'mainnet') {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });

  const limit = 50; //default and max is 50
  let coins = [];
  let cursor = null;

  if (coinType) {
    while (true) {
      let resp = await suiClient.getCoins({
        owner: address,
        limit,
        cursor: cursor,
      });
      coins = [...coins, ...resp.data];
      if (resp.hasNextPage) {
        cursor = resp.nextCursor;
      } else {
        break;
      }
    }
    return coins;
  } else {
    while (true) {
      let resp = await suiClient.getAllCoins({
        owner: address,
        limit,
        cursor: cursor,
      });
      coins = [...coins, ...resp.data];
      if (resp.hasNextPage) {
        cursor = resp.nextCursor;
      } else {
        break;
      }
    }
    return coins;
  }
}

async function getMetada(coinType) {
  const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
  const metadata = await suiClient.getCoinMetadata({
    coinType,
  });
  console.log(metadata);
  return metadata;
}

async function main() {
  const address = '0x75d584e15101f5d0b4db18e9f5ed35931d6e47a9a4c367ed02fa3063cee1dd68';
  const coins = await getCoins(address);

  for (const coin of coins.data) {
    console.log(coin.coinType);
  }
}

async function mergeSuiCoins(keypair, network) {
  const ownerAddress = keypair.toSuiAddress();
  const tx = new Transaction();
  tx.setSender(ownerAddress);

  const coins = await getCoins(ownerAddress, config.SUI_COIN_TYPE, network);

  // For SUI coins, we need special handling since it's also used for gas payment
  if (coins.data.length <= 1) {
    console.log('No SUI coins to merge or only one coin available');
    return;
  }

  if (coins.data.length === 2) {
    console.log(
      '====No SUI coins to merge(Only two coins available, the first coin had been used as gas)===='
    );
    return;
  }

  // Use the first coin as gas payment
  const gasObject = coins.data[0];
  // Explicitly set the gas payment object - must use the gas object itself, not just ID
  tx.setGasPayment([
    {
      objectId: gasObject.coinObjectId,
      version: gasObject.version,
      digest: gasObject.digest,
    },
  ]);

  // Select the second coin as primary, merge remaining coins into it
  const primaryCoin = coins.data[1].coinObjectId;

  const remainingCoins = coins.data.slice(2).map(coin => coin.coinObjectId);

  tx.mergeCoins(primaryCoin, remainingCoins);

  const suiClient = new SuiClient({
    url: getFullnodeUrl(network),
  });
  const builtTx = await tx.build({ client: suiClient });

  const txnDigest = await suiClient.signAndExecuteTransaction({
    transaction: builtTx,
    signer: keypair,
    requestType: 'WaitForLocalExecution',
  });
  console.log(txnDigest);
  return txnDigest;
}

async function mergeNonSuiCoins(coinType, keypair, network) {
  const ownerAddress = keypair.toSuiAddress();
  const tx = new Transaction();
  tx.setSender(ownerAddress);

  const coins = await getCoins(ownerAddress, coinType, network);

  // Check if there are enough coins to merge
  if (coins.data.length <= 1) {
    console.log(`No ${coinType} coins to merge or only one coin available`);
    return;
  }

  const coinObjectIds = coins.data.map(coin => coin.coinObjectId);
  const primaryCoin = coinObjectIds[0];
  const otherCoins = coinObjectIds.slice(1);

  tx.mergeCoins(primaryCoin, otherCoins);

  const suiClient = new SuiClient({
    url: getFullnodeUrl(network),
  });
  const builtTx = await tx.build({ client: suiClient });

  const txnDigest = await suiClient.signAndExecuteTransaction({
    transaction: builtTx,
    signer: keypair,
    requestType: 'WaitForLocalExecution',
  });
  console.log(txnDigest);
  return txnDigest;
}

async function mergeCoins(coinType, keypair, network) {
  if (coinType === config.SUI_COIN_TYPE) {
    return await mergeSuiCoins(keypair, network);
  } else {
    return await mergeNonSuiCoins(coinType, keypair, network);
  }
}

async function mintZeroCoin(coinType, keypair, network = 'mainnet') {
  const ownerAddress = keypair.toSuiAddress();
  const tx = new Transaction();
  tx.setSender(ownerAddress);
  tx.setGasBudget(50000000);

  // 创建零币
  const zeroCoin = tx.moveCall({
    target: '0x2::coin::zero',
    arguments: [],
    typeArguments: [coinType],
  });

  // 将创建的零币转移给拥有者
  tx.transferObjects([zeroCoin], ownerAddress);

  const suiClient = new SuiClient({
    url: getFullnodeUrl(network),
  });
  const builtTx = await tx.build({ client: suiClient });
  const txnDigest = await suiClient.signAndExecuteTransaction({
    transaction: builtTx,
    signer: keypair,
    requestType: 'WaitForLocalExecution',
  });
  console.log(txnDigest);
}

if (require.main === module) {
  // main();

  // getMetada(config.MAINNET.USDC_COIN_TYPE);

  const SUI_PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
  const keypair = Ed25519Keypair.fromSecretKey(SUI_PRIVATE_KEY);

  // mergeCoins(config.SUI_COIN_TYPE, keypair, 'devnet');
  // mintZeroCoin(config.SUI_COIN_TYPE, keypair);

  getCoins(
    '0xe28b50cef1d633ea43d3296a3f6b67ff0312a5f1a99f0af753c85b8b5de8ff06',
    '0x2::sui::SUI'
  ).then(coins => {
    console.log(coins);
  });
}
