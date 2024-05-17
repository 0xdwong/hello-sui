# Sui CLI

## 安装
- 检查 `sui --version`
- Mac 安装: `brew install sui`


## 常用命令
- 配置 Sui 客户端： `sui client`
- 检查当前可用的环境别名：`sui client envs`
- 自定义 RPC 端点添加新别名：  
  `sui client new-env --alias <ALIAS> --rpc <RPC-SERVER-URL>`
  - devnet: https://fullnode.devnet.sui.io:443
  - testnet: https://fullnode.testnet.sui.io:443
- 切换活动网络： 
  `sui client switch --env <ALIAS>`
- 生成新的 Sui 地址
  `sui client new-address ed25519`，
  `ed25519` 指定密钥对方案标志的类型，另外两个是 `secp256k1`和`secp256r1`
- 获取 SUI：`sui client faucet`
- `sui client gas`

- 创建包 `sui move new my_package`
- 构建包 `sui move build`
- 测试 `sui move test`
- 发布包 `sui client publish`
  -  --skip-dependency-verification
- 显示对象 `sui client objects`
- 


[warn] Client/Server api version mismatch, client api version : 1.24.1, server api version : 1.25.0