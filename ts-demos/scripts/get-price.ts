import { getPrice } from "../src/cetus/Aggregator";
import config from "../src/config";

async function main() {
  const price = await getPrice(
    "0x2::sui::SUI",
    9,
    config.MAINNET.USDC_COIN_TYPE,
    6
  );
  console.log(price);
}

main();
