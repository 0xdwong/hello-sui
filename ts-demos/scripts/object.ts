import {
  SuiClient,
  getFullnodeUrl,
  DynamicFieldName,
} from "@mysten/sui/client";
import * as objectApi from "../src/object";

const suiClient = new SuiClient({
  url: getFullnodeUrl("mainnet"), // 或 'testnet', 'devnet'
});

async function getDynamicFields() {
  const parentId =
    "0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9";

  const dynamics = await objectApi.getDynamicFields(suiClient, parentId);

  console.log(dynamics[0]);
}

async function getDynamicFieldObjectByName() {
  const parentId =
    "0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9";
  const filedName: DynamicFieldName = {
    type: "0xe7dbb371a9595631f7964b7ece42255ad0e738cc85fe6da26c7221b220f01af6::market_dynamic_keys::BorrowLimitKey",
    value: {
      type: {
        name: "7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA",
      },
    },
  };
  const filedValeObj = await objectApi.getDynamicFieldObjectByName(
    suiClient,
    parentId,
    filedName
  );

  console.log("动态字段对象:", filedValeObj);
}

async function main() {
  await getDynamicFields();

  // await getDynamicFieldObjectByName();
}

main();
