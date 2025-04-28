# 发布网站到 Walrus

Walrus Sites 是基于 Sui 区块链和 Walrus 技术构建的去中心化网站托管平台。通过简单的步骤，你可以轻松发布网站而无需管理服务器或复杂配置。

## 准备工作

开始前，请确保：

1. 已安装最新版本的 [Rust](https://www.rust-lang.org/tools/install)
2. 已完成 [Walrus 设置指南](./setup.md) 中的所有步骤

## 安装 site-builder 工具

下载适合你系统的 site-builder：

```sh
# Mainnet
# 选择适合你的系统: ubuntu-x86_64, macos-x86_64, macos-arm64, windows-x86_64.exe
SYSTEM=macos-arm64

curl https://storage.googleapis.com/mysten-walrus-binaries/site-builder-mainnet-latest-$SYSTEM -o site-builder

chmod +x site-builder
```

将二进制文件移动到 `$PATH` 环境变量包含的目录中：

```sh
mv site-builder $HOME/.local/bin/
```

## 配置 site-builder

创建配置文件：

```sh
mkdir -p ~/.config/walrus
vi ~/.config/walrus/sites-config.yaml
```

将以下内容添加到配置文件中：

```yaml
contexts:
  testnet:
    package: 0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799
  mainnet:
    package: 0x26eb7ee8688da02c5f671679524e379f0b837a12f1d1d799f255b7eea260ad27

default_context: mainnet
```

或直接下载官方配置文件：

```sh
curl https://raw.githubusercontent.com/MystenLabs/walrus-sites/refs/heads/mainnet/sites-config.yaml -o ~/.config/walrus/sites-config.yaml
```

## 准备网站内容

Walrus Sites 支持任何生成静态内容的 Web 框架。你的网站目录必须包含 `index.html` 作为入口点。

参考示例：

```sh
git clone https://github.com/MystenLabs/example-walrus-sites.git
cd example-walrus-sites
```

## 发布网站

准备好网站内容后，使用以下命令发布：

```sh
site-builder publish ./your-site-directory --epochs 1
```

`--epochs` 参数指定网站的可用周期数（可使用 `max` 表示最大周期）。在 Testnet 上，一个周期为两天；在 Mainnet 上，一个周期为两周。

发布成功后，你将看到类似输出：

```
Execution completed
Resource operations performed:
  - created resource /index.html with blob ID AR03hvxSlyfYl-7MhXct4y3rnIIGPHdnjiIF03BK_XY
  - created resource /style.css with blob ID xK8K1Q5khrl3eBT4jEiB-L_gyShEIOVWti8DcAoEjtw
  ...
Created new site: Your Site Name
New site object ID: 0xe674c144119a37a0ed9cef26a962c3fdfbdbfd86a3b3db562ee81d5542a4eccf
```

记录输出中的 `New site object ID`，后续步骤需要使用。

## 设置 SuiNS 名称

为了使你的 Walrus 网站易于访问，请设置 SuiNS 名称：

1. 访问 [SuiNS.io](https://suins.io)（Mainnet）或 [Testnet.SuiNS.io](https://testnet.suins.io)（Testnet）
2. 使用钱包购买域名（仅支持字母 a-z 和数字 0-9）
3. 在"names you own"部分，点击域名旁边的"三点"菜单
4. 选择"Link To Walrus Site"选项
5. 粘贴之前获得的 Walrus Site 对象 ID
6. 点击"Apply"并批准交易

完成后，网站将通过 `https://域名.wal.app` 访问。

## 更新网站

更新网站内容：

```sh
site-builder update --epochs 1 ./your-updated-site-directory 0xe674c144...
```

其中 `0xe674c144...` 是你的网站对象 ID。系统将只替换已更改的文件。

请注意，只有网站对象的所有者才能更新它。如果需要延长网站的过期日期，可以使用带有`--check-extend`标志的`update`命令：

```sh
site-builder update --epochs 1 --check-extend ./your-site-directory 0xe674c144...
```

## 访问网站

发布后，有两种方式访问网站：

1. 本地门户：`http://your-base36-id.localhost:3000`
2. 通过 SuiNS 名称访问：`https://your-domain.wal.app`
