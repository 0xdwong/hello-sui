const { DeepBookClient } = require('@mysten/deepbook-v3');
const { SuiClient } = require('@mysten/sui/client');

function initDeepbookClient(network = 'mainnet') {
  const client = new SuiClient({
    url: 'https://fullnode.mainnet.sui.io:443',
  });

  const deepbookClient = new DeepBookClient({
    client,
    address: '0x2',
    env: network,
  });
  return deepbookClient;
}

module.exports = {
  initDeepbookClient,
};
