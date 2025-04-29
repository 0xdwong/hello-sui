const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const isValidSuiAddress = require('@mysten/sui/utils').isValidSuiAddress;
const { VESTA_DROP_CLASIMS_ID } = require('./config');

async function lookupAirdrop(userAddress) {
  const network = 'mainnet';
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //  Query dynamic field
  const record = await suiClient.getDynamicFieldObject({
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

async function batchLookupAirdrop(userAddresses) {
  let airdropInfos = [];
  for (const userAddress of userAddresses) {
    const airdropInfo = await lookupAirdrop(userAddress);
    airdropInfos.push(airdropInfo);
  }
  return airdropInfos;
}

async function main() {
  const args = process.argv.slice(2);
  const userAddressesString = args[0];
  if (!userAddressesString) {
    console.log('请输入用户地址');
    return;
  }
  const userAddresses = userAddressesString.split(',');

  if (userAddresses.length === 0) {
    console.log('请输入用户地址');
    return;
  }

  userAddresses.forEach(address => {
    if (!isValidSuiAddress(address)) {
      console.log('用户地址格式错误');
      return;
    }
  });

  console.log('userAddresses', userAddresses);

  const result = await batchLookupAirdrop(userAddresses);
  console.log('airdrop infos\n', result);
}

main();
