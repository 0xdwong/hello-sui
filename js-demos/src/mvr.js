const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const config = require('./config');
const rpc = require('./rpc');

const network = 'mainnet';
const client = new SuiClient({ url: getFullnodeUrl(network) });

async function getAppRecord(appName, orgName) {
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

  return appRecord.error ? null : appRecord;
}

async function getAppInfos(appName, orgName) {
  const appRecord = await getAppRecord(appName, orgName);

  //  Parse result
  if (!appRecord || appRecord.data?.content?.dataType !== 'moveObject') return;

  const fields = appRecord.data.content.fields.value.fields;

  // Mainnet package address
  const mainnetPackageAddress = fields.app_info?.fields.package_address;
  const mainnetPackageInfoID = fields.app_info?.fields.package_info_id;

  // Testnet package address (found in networks field)
  const networks = fields.networks.fields.contents;

  const testnetInfo = networks.find(x => x.fields.key === config.CHAIN_IDs.TESTNET);
  const testnetPackageAddress = testnetInfo?.fields.value.fields.package_address;
  const testnetPackageInfoID = testnetInfo?.fields.value.fields.package_info_id;

  return {
    mainnet: {
      packageAddress: mainnetPackageAddress,
      packageInfoID: mainnetPackageInfoID,
    },
    testnet: {
      packageAddress: testnetPackageAddress,
      packageInfoID: testnetPackageInfoID,
    },
  };
}

async function getAppMetadata(appName, orgName) {
  const appRecord = await getAppRecord(appName, orgName);

  // Parse result
  if (!appRecord || appRecord.data?.content?.dataType !== 'moveObject') return null;
  const fields = appRecord.data.content.fields.value.fields;

  const contents = fields.metadata.fields.contents;

  const metadata = {};
  for (const content of contents) {
    metadata[content.fields.key] = content.fields.value;
  }
  return metadata;
}

async function getAppName(packageInfoID) {
  const packageInfo = await rpc.getObject(packageInfoID);
  const metadata = packageInfo?.content?.fields?.metadata;
  const contents = metadata?.fields?.contents;
  const appName = contents?.find(x => x.fields?.key === 'default')?.fields?.value;

  return appName;
}

module.exports = {
  getAppInfos,
  getAppMetadata,
  getAppName,
};
