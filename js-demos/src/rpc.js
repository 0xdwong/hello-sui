const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');

async function resolveNameServiceAddress(domain, network = 'mainnet') {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const resp = await suiClient.resolveNameServiceAddress({
    name: domain,
  });

  if (!resp) {
    console.log(`${domain} => no address associated`);
    return;
  }
  const address = resp;

  console.log(`${domain} => ${address}`);

  return address;
}

async function resolveNameServiceNames(address, network = 'mainnet') {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const resp = await suiClient.resolveNameServiceNames({
    address,
  });

  if (!resp.data.length) {
    console.log(`${address} => no domain associated`);
    return;
  }

  console.log(`${address} => ${resp.data[0]}`);

  return resp.data[0];
}

async function getObject(objectId, network = 'mainnet') {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const resp = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
      showOwner: true,
      showType: true,
      showStorageRebate: true,
    },
  });

  if (resp?.error) {
    console.log(resp.error);
    return;
  }

  const objectData = resp.data;

  console.log(objectData);

  return objectData;
}

async function main() {
  // query address associated with the given domain
  await resolveNameServiceAddress('buidler.sui', 'mainnet');

  // query domain name associated with the given address
  // await resolveNameServiceNames(
  //   '0xb5f59df8059cccb0f4f9a55e8adf60f0bbc16180cb9ccf5d50e0c1c3e2bd4401',
  //   'mainnet'
  // );

  // query object data
  // await getObject('0x204044eb6e73241a578c90d6560d7ddacfc469620a8c2ab3eddd36b886fef368');
}

main();
