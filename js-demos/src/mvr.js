const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const config = require('./config');
const rpc = require('./rpc');

const network = 'mainnet';
const client = new SuiClient({ url: getFullnodeUrl(network) });

async function getPackageAddress(appName, orgName) {
  // 1. Create Name structure
  const name = {
    type: `${config.MVR.appsNameType}`,
    value: {
      app: [appName], // Application name part
      org: {
        labels: orgName, // Organization name part, note that domain labels need to be reversed
      },
    },
  };

  // 2. Query dynamic field
  const appRecord = await client.getDynamicFieldObject({
    parentId: config.MVR.appsRegistryTableId, // appsRegistryTableId
    name: name,
  });

  // 3. Parse result
  if (appRecord.data?.content?.dataType === 'moveObject') {
    const fields = appRecord.data.content.fields.value.fields;

    // Mainnet package address
    const mainnetPackageAddress = fields.app_info?.fields.package_address;
    const mainnetPackageInfoID = fields.app_info?.fields.package_info_id;

    // Testnet package address (found in networks field)
    const networks = fields.networks.fields.contents;

    const testnetInfo = networks.find(x => x.fields.key === config.CHAIN_IDs.TESTNET);
    const testnetPackageAddress = testnetInfo?.fields.value.fields.package_address;
    const testnetPackageInfoID = testnetInfo?.fields.value.fields.package_info_id;

    console.log('Mainnet Package ID:', mainnetPackageAddress);
    console.log('Mainnet Package info id:', mainnetPackageInfoID);

    console.log('Testnet Package ID:', testnetPackageAddress);
    console.log('Testnet Package info id:', testnetPackageInfoID);
  }
}

async function getAppName(packageInfoID) {
  const packageInfo = await rpc.getObject(packageInfoID);
  const metadata = packageInfo?.content?.fields?.metadata;
  const contents = metadata?.fields?.contents;
  const appName = contents?.find(x => x.fields?.key === 'default')?.fields?.value;

  return appName;
}

module.exports = {
  getPackageAddress,
  getAppName,
};
