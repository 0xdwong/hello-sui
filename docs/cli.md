# Sui CLI

## 安装
- 检查 `sui --version`
- Mac 安装: `brew install sui`


## 常用命令
- 配置 `sui client`
- 检查当前可用的环境别名 `sui client envs`
- 自定义 RPC 端点添加新别名 `sui client new-env --alias <ALIAS> --rpc <RPC-SERVER-URL>`
  - devnet: https://fullnode.devnet.sui.io:443
  - testnet: https://fullnode.testnet.sui.io:443
- 切换活动网络 `sui client switch --env <ALIAS>`