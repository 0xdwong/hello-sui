# Walrus 网站托管完全指南

![Walrus网站托管](https://via.placeholder.com/800x400?text=Walrus去中心化网站托管示意图)

通过 Walrus Sites，你可以轻松发布完全去中心化的网站，无需依赖传统的中心化服务器。本指南将详细介绍如何从零开始构建和部署一个 Walrus 网站。

## 1. 去中心化网站的优势

传统网站托管依赖中心化服务器，存在单点故障风险和中心化控制。Walrus Sites 通过结合 Sui 区块链和 Walrus 存储网络，提供了一个全新的去中心化网站托管方案：

![去中心化与传统网站对比](https://via.placeholder.com/700x350?text=去中心化与传统网站对比图)

| 特性       | 传统网站托管 | Walrus 网站    |
| ---------- | ------------ | -------------- |
| 去中心化   | ❌           | ✅             |
| 抗审查     | ❌           | ✅             |
| 无单点故障 | ❌           | ✅             |
| 区块链集成 | 需额外开发   | ✅ 原生支持    |
| 内容持久性 | 依赖服务商   | ✅ 链上保证    |
| 域名系统   | 传统 DNS     | SuiNS 去中心化 |

## 2. 准备工作

在开始之前，你需要满足以下条件：

1. **安装 Rust**：Walrus 的一些工具依赖 Rust

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **安装 Walrus 工具**：按照[Walrus 设置指南](./setup.md)完成环境配置

3. **准备 Sui 钱包**：需要有 SUI 代币用于支付存储费用和创建网站对象

4. **网站内容**：准备好要发布的静态网站内容（HTML, CSS, JavaScript 等）

## 3. 安装 site-builder 工具

Walrus 提供了专用的`site-builder`工具，用于网站发布和管理：

```bash
# 选择适合你的系统: ubuntu-x86_64, macos-x86_64, macos-arm64, windows-x86_64.exe
SYSTEM=macos-arm64

# 下载主网版本
curl https://storage.googleapis.com/mysten-walrus-binaries/site-builder-mainnet-latest-$SYSTEM -o site-builder

# 设置执行权限
chmod +x site-builder

# 移动到系统路径
mv site-builder $HOME/.local/bin/
```

验证安装：

```bash
site-builder --version
```

## 4. 配置 site-builder

创建并设置配置文件：

```bash
# 创建配置目录
mkdir -p ~/.config/walrus

# 创建配置文件
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

或者直接下载官方配置文件：

```bash
curl https://raw.githubusercontent.com/MystenLabs/walrus-sites/refs/heads/mainnet/sites-config.yaml -o ~/.config/walrus/sites-config.yaml
```

## 5. 准备网站内容

![网站内容结构](https://via.placeholder.com/650x350?text=网站内容结构示意图)

Walrus Sites 支持任何生成静态内容的 Web 框架，例如：

- React (通过`npm run build`生成静态文件)
- Vue.js
- Angular
- 纯 HTML/CSS/JavaScript
- Jekyll、Hugo 等静态站点生成器

你的网站目录必须包含`index.html`作为入口点。以下是一个基本的网站结构示例：

```
my-walrus-site/
│
├── index.html             # 主页面（必需）
├── style.css              # 样式文件
├── script.js              # JavaScript文件
│
├── assets/                # 资源文件夹
│   ├── images/            # 图片资源
│   ├── fonts/             # 字体资源
│   └── ...
│
└── pages/                 # 其他页面
    ├── about.html
    └── contact.html
```

如果你需要示例项目作为起点，可以克隆官方示例仓库：

```bash
git clone https://github.com/MystenLabs/example-walrus-sites.git
cd example-walrus-sites
```

## 6. 发布网站

准备好网站内容后，使用以下命令发布：

```bash
site-builder publish ./your-site-directory --epochs 1
```

参数说明：

- `./your-site-directory`：你的网站目录路径
- `--epochs 1`：网站的可用周期数
  - 可使用`max`表示最大周期
  - 在 Testnet 上，一个周期为两天
  - 在 Mainnet 上，一个周期为两周

![发布流程](https://via.placeholder.com/700x300?text=Walrus网站发布流程图)

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

**重要：** 记录输出中的`New site object ID`，后续步骤需要使用。

## 7. 设置 SuiNS 域名

为了让你的 Walrus 网站易于访问，你可以使用 SuiNS（Sui 名称服务）为网站设置一个易记的域名：

![SuiNS域名设置](https://via.placeholder.com/650x300?text=SuiNS域名设置流程图)

1. 访问[SuiNS.io](https://suins.io)（Mainnet）或[Testnet.SuiNS.io](https://testnet.suins.io)（Testnet）
2. 连接你的 Sui 钱包
3. 购买一个域名（仅支持字母 a-z 和数字 0-9）
4. 在"names you own"部分，点击域名旁边的"三点"菜单
5. 选择"Link To Walrus Site"选项
6. 粘贴之前获得的 Walrus Site 对象 ID
7. 点击"Apply"并批准交易

完成后，你的网站将可以通过`https://你的域名.wal.app`访问。

## 8. 更新网站内容

当你需要更新网站内容时，只需使用以下命令：

```bash
site-builder update --epochs 1 ./your-updated-site-directory 0xe674c144...
```

其中`0xe674c144...`是你的网站对象 ID。系统只会替换已更改的文件，提高更新效率。

需要注意的是，只有网站对象的所有者才能更新它。如果你想延长网站的过期日期，可以使用带有`--check-extend`标志的`update`命令：

```bash
site-builder update --epochs 1 --check-extend ./your-site-directory 0xe674c144...
```

## 9. 网站性能优化建议

为了提升你的 Walrus 网站性能，可以考虑以下优化策略：

![网站优化](https://via.placeholder.com/650x300?text=Walrus网站优化策略图)

1. **资源压缩**：压缩 HTML、CSS 和 JavaScript 文件

   ```bash
   # 使用工具如gzip压缩文件
   gzip -9 script.js style.css
   ```

2. **图像优化**：使用 WebP 或优化的 JPEG/PNG 格式

   ```bash
   # 使用imagemin等工具优化图像
   npx imagemin images/* --out-dir=optimized-images
   ```

3. **资源合并**：减少 HTTP 请求数量

   ```bash
   # 使用Webpack等工具合并资源
   npx webpack --config webpack.config.js
   ```

4. **延迟加载**：非关键资源延迟加载

   ```html
   <img loading="lazy" src="image.jpg" alt="Lazy loaded image" />
   ```

5. **资产 CDN**：将一些公共库链接到 CDN

## 10. 访问和监控网站

发布后，有两种方式访问你的网站：

1. **本地门户**：`http://your-base36-id.localhost:3000`
2. **通过 SuiNS 名称**：`https://your-domain.wal.app`

要监控你的网站状态，可以使用以下命令：

```bash
# 查看网站信息
site-builder info 0xe674c144...

# 查看网站资源列表
site-builder list-resources 0xe674c144...
```

## 常见问题解答

**Q: 网站更新后为什么看不到变化？**  
A: 浏览器缓存可能导致显示旧内容。尝试强制刷新（Ctrl+F5）或清除浏览器缓存。

**Q: Walrus 网站支持后端功能吗？**  
A: Walrus Sites 主要用于托管静态内容。对于后端功能，你可以将 Walrus 网站作为前端，通过 API 与 Sui Move 智能合约或其他后端服务交互。

**Q: 如何备份我的网站内容？**  
A: 保持本地源文件的备份。此外，你可以使用`site-builder download`命令下载已发布网站的内容：

```bash
site-builder download 0xe674c144... ./backup-directory
```

## 总结

通过 Walrus Sites，你现在可以轻松创建和部署真正去中心化的网站。这种方式不仅提供了传统网络托管无法比拟的抗审查能力和可靠性，还与 Sui 区块链生态无缝集成，为 Web3 应用提供了理想的前端解决方案。

在接下来的文章中，我们将探讨更高级的 Walrus 开发主题，包括如何将区块链功能与 Walrus 网站集成、优化大规模应用等内容。

## 进一步学习资源

- [Walrus Sites GitHub 仓库](https://github.com/MystenLabs/walrus-sites)
- [示例项目集合](https://github.com/MystenLabs/example-walrus-sites)
- [SuiNS 官方文档](https://docs.suins.io/)
