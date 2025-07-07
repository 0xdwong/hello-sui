import { Cetus } from "../src/cetus";
import config from "../src/config";

async function getPriceByCetus() {
  const cetus = new Cetus();

  const coinType = "0x2::sui::SUI";
  const coinName = coinType.split("::")[2];
  const coinDecimal = 9;
  const baseCoinType = config.MAINNET.USDC_COIN_TYPE;
  const baseCoinDecimal = 6;

  const price = await cetus.getPrice(
    coinType,
    coinDecimal,
    baseCoinType,
    baseCoinDecimal
  );
  console.log(`${coinName} price:`, price);
}

async function main() {
  await getPriceByCetus();
}

main();
