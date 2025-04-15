const rpc = require('./rpc');

async function getObject(objectId) {
  const objectData = await rpc.getObject(objectId);
  console.log(objectData);
}

async function main() {
  await getObject('0x204044eb6e73241a578c90d6560d7ddacfc469620a8c2ab3eddd36b886fef368');
}

main();
