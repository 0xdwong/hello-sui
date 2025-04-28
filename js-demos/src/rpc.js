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

  return objectData;
}

async function getTransactionBlock(txHash, network = 'mainnet') {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const resp = await suiClient.getTransactionBlock({
    digest: txHash,
    options: {
      showBalanceChanges: true,
      showEffects: true,
      showEvents: true,
      showInput: true,
      showObjectChanges: true,
      showRawEffects: true,
      showRawInput: true,
    },
  });

  return resp;
}

module.exports = {
  resolveNameServiceAddress,
  resolveNameServiceNames,
  getObject,
  getTransactionBlock,
};
