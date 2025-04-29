const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const { Transaction } = require('@mysten/sui/transactions');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const dotenv = require('dotenv');
dotenv.config();

const { VESTA_DROP_ID, VESTA_DROP_CLASIMS_ID, VERSIONED_ID } = require('./config');
const network = 'mainnet';
const client = new SuiClient({ url: getFullnodeUrl(network) });

async function lookupAirdrop(userAddress) {
  //  Query dynamic field
  const record = await client.getDynamicFieldObject({
    parentId: VESTA_DROP_CLASIMS_ID,
    name: {
      type: 'address',
      value: userAddress,
    },
  });

  if (record.error) {
    if (record.error.code === 'dynamicFieldNotFound') {
      return { amount: '0', claimed: false };
    }
    console.log('error', record.error);
    return null;
  }

  const fieldData = record.data.content;
  if (!fieldData || !fieldData.fields) return null;

  const airdropInfo = fieldData.fields.value;
  if (!airdropInfo || !airdropInfo.fields) return null;

  return airdropInfo.fields;
}

async function claimAirdrop(keypair) {
  const userAddress = keypair.toSuiAddress();
  console.log('userAddress', userAddress);
  const airdropInfo = await lookupAirdrop(userAddress);
  if (!airdropInfo) {
    console.log('查询空投失败');
    return;
  }

  const airdropAmount = Number(airdropInfo.amount);
  if (airdropAmount === 0) {
    console.log('用户没有分配空投');
    return;
  }

  const tx = new Transaction();
  tx.setSender(userAddress);
  tx.setGasBudget(50000000);

  tx.moveCall({
    target: `0x27f5a65655f8e0287e89c05370e28570b64b4305447011e6e34d8564b41c7a0c::vesta_drop::claim`,
    arguments: [tx.object(VERSIONED_ID), tx.object(VESTA_DROP_ID), tx.object('0x6')],
  });

  const builtTx = await tx.build({ client });

  const txnDigest = await client.signAndExecuteTransaction({
    transaction: builtTx,
    signer: keypair,
  });

  const txn = await client.waitForTransaction(txnDigest);
  console.log(txn);
}

async function main() {
  const args = process.argv.slice(2);
  const privateKey = args[0] || process.env.SUI_PRIVATE_KEY;

  if (!privateKey) {
    console.log('请输入私钥');
    return;
  }

  const keypair = Ed25519Keypair.fromSecretKey(privateKey);
  await claimAirdrop(keypair);
}

main();
