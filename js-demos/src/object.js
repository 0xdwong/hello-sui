const rpc = require('./rpc');

async function getObject(objectId) {
  const objectData = await rpc.getObject(objectId);
  console.log(objectData);
}

module.exports = {
  getObject,
};
