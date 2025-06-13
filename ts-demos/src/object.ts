import { SuiClient, DynamicFieldName } from "@mysten/sui/client";

export async function getDynamicFields(suiClient: SuiClient, parentId: string) {
  // 获取对象的动态字段列表
  const dynamicFields = await suiClient.getDynamicFields({
    parentId: parentId,
    // cursor: null, // 用于分页
    // limit: 50,    // 限制返回数量
  });
  return dynamicFields.data;
}

export async function getDynamicFieldObjectByName(
  suiClient: SuiClient,
  parentId: string,
  name: DynamicFieldName
) {
  const dynamicFieldValueObject = await suiClient.getDynamicFieldObject({
    parentId,
    name,
  });
  return dynamicFieldValueObject;
}
