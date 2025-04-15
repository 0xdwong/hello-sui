// 获取交易对中间价格
async function getMidPrice(poolKey, deepbookClient) {
  try {
    console.log(`尝试获取交易对 ${poolKey} 的中间价格`);
    const price = await deepbookClient.midPrice(poolKey);
    return price;
  } catch (error) {
    console.error(`获取 ${poolKey} 中间价格失败:`, error);
    return null;
  }
}

module.exports = {
  getMidPrice,
};
