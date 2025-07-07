import * as utils from "../src/utils/keypair";

function getRandomKeypair() {
  const keypair = utils.getRandomKeypair();
  const accountInfo = utils.getAccountInfoFromKeypair(keypair);
  console.log(accountInfo);
}

async function main() {
  getRandomKeypair();
}

main();
