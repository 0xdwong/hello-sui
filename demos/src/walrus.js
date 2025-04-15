const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const { WalrusClient } = require('@mysten/walrus');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const { Agent, fetch } = require('undici');
const assert = require('assert');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./config');

const SUI_PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
function getWalrusClient(network) {
  const suiClient = new SuiClient({
    url: getFullnodeUrl(network),
  });

  const walrusClient = new WalrusClient({
    network: network,
    suiClient,
    storageNodeClientOptions: {
      timeout: 60_000,
      fetch: (url, init) => {
        return fetch(url, {
          ...init,
          dispatcher: new Agent({
            connectTimeout: 60_000,
          }),
        });
      },
    },
  });

  return walrusClient;
}

async function readObject(blobId, network = 'mainnet') {
  const walrusClient = getWalrusClient(network);
  const blob = await walrusClient.readBlob({ blobId });
  console.log(blob);
}

async function getWalrusBalance(address, network = 'mainnet') {
  const suiClient = new SuiClient({
    url: getFullnodeUrl(network),
  });

  const WALRUS_COIN_TYPE = config[network.toUpperCase()].WALRUS_COIN_TYPE;
  const WALRUS_COIN_DECIMALS = config[network.toUpperCase()].WALRUS_COIN_DECIMALS;

  const coins = await suiClient.getCoins({
    owner: address,
    coinType: WALRUS_COIN_TYPE,
  });

  const balance = coins.data.reduce((acc, coin) => acc + Number(coin.balance), 0);

  console.log(`balance: ${balance}, ${balance / 10 ** WALRUS_COIN_DECIMALS} WAL`);
  return balance;
}

async function writeObject(text, network = 'mainnet') {
  assert(SUI_PRIVATE_KEY, 'SUI_PRIVATE_KEY is not set');
  const keypair = Ed25519Keypair.fromSecretKey(SUI_PRIVATE_KEY);
  console.log('==using address==', keypair.toSuiAddress());

  const file = new TextEncoder().encode(text);

  const walrusClient = getWalrusClient(network);
  const { blobId } = await walrusClient.writeBlob({
    blob: file,
    deletable: false,
    epochs: 3,
    signer: keypair,
  });

  console.log(blobId);
}

async function main() {
  // await getWalrusBalance('0xb1120e665ce0d4035879bc216d86c0a1fb4eeff782d2de9ab1b4ddec351a8ad0');
  // await readObject('FRW9FI1XFygm1BTBnmVxoKvCdOG2gqJL32qUt4n5txc');
  // await writeObject('hello sui and walrus\n', 'testnet');
}

main();
