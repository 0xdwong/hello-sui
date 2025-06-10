import { Transaction } from "@mysten/sui/transactions";
import { SuiClient, SuiObjectChange } from "@mysten/sui/client";
import { DeepBookClient } from "@mysten/deepbook-v3";

import { executeTransaction } from "../utils";
import * as constants from "../constants";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export async function createBalanceManager(
  suiClient: SuiClient,
  keypair: Ed25519Keypair
) {
  const tx = new Transaction();

  const balanceManager = tx.moveCall({
    target: `${constants.PackageId.Deepbook}::balance_manager::new`,
  });

  tx.moveCall({
    target: "0x2::transfer::public_share_object",
    arguments: [balanceManager],
    typeArguments: [
      `${constants.PackageId.Deepbook}::balance_manager::BalanceManager`,
    ],
  });

  const resp = await executeTransaction(suiClient, tx, keypair);
  const objectChanges = resp.objectChanges!;
  const balanceManagerObject = objectChanges.find(
    (ele: any) =>
      ele.objectType ===
      `${constants.PackageId.Deepbook}::balance_manager::BalanceManager`
  );

  return balanceManagerObject && "objectId" in balanceManagerObject
    ? balanceManagerObject.objectId
    : null;
}

// TODO: wait for contract updated
export async function createUserBalanceManager(
  suiClient: SuiClient,
  keypair: Ed25519Keypair,
  userAddress?: string
) {
  if (!userAddress) userAddress = keypair.toSuiAddress();

  const tx = new Transaction();

  const balanceManager = tx.moveCall({
    target: `${constants.PackageId.Deepbook}::balance_manager::new_with_custom_owner`,
    arguments: [tx.pure.address(userAddress)],
  });

  tx.moveCall({
    target: "0x2::transfer::public_share_object",
    arguments: [balanceManager],
    typeArguments: [
      `${constants.PackageId.Deepbook}::balance_manager::BalanceManager`,
    ],
  });

  return await executeTransaction(suiClient, tx, keypair);
}

// TODO: wait for contract updated
export async function createUserBalanceManager2(
  suiClient: SuiClient,
  keypair: Ed25519Keypair,
  userAddress?: string
) {
  if (!userAddress) userAddress = keypair.toSuiAddress();

  const dbClient = new DeepBookClient({
    address: userAddress,
    env: "mainnet",
    client: suiClient,
  });

  const tx = new Transaction();
  dbClient.balanceManager.createAndShareBalanceManagerWithOwner(userAddress)(
    tx
  );

  return await executeTransaction(suiClient, tx, keypair);
}
