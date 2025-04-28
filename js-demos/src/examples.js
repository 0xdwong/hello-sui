const rpc = require('./rpc');
const object = require('./object');
const mvr = require('./mvr');

async function getTransactionBlock() {
  const txHash = '';
  const tx = await rpc.getTransactionBlock(txHash, (network = 'mainnet'));
  return tx;
}

async function main() {
  let result;
  // query address associated with the given domain
  // await rpc.resolveNameServiceAddress('buidler.sui', 'mainnet');

  // query domain name associated with the given address
  // await rpc.resolveNameServiceNames(
  //   '0xb5f59df8059cccb0f4f9a55e8adf60f0bbc16180cb9ccf5d50e0c1c3e2bd4401',
  //   'mainnet'
  // );

  // query object data
  // await object.getObject('0x0e5d473a055b6b7d014af557a13ad9075157fdc19b6d51562a18511afd397727');

  // await getTransactionBlock();

  // await mvr.getPackageAddress('hello-world', ['sui', 'pkg']);

  result = await mvr.getAppName(
    '0x25ed6521ce3755cec06285b915277bd9e829fb1addf5f4722ab95c0d3457b3d5'
  );
  console.log(result);
}

main();
