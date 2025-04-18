# 开发环境配置

在开始编写 Move 程序之前，需要设置一个适当的开发环境。本章将介绍如何安装 Sui 命令行工具及配置开发环境。

## 安装 Sui

Move 是一种编译型语言，因此需要安装编译器才能编写和运行 Move 程序。编译器包含在 Sui 二进制文件中，可以通过以下几种方法安装或下载。

### 下载二进制文件

可以从 [releases 页面](https://github.com/MystenLabs/sui/releases) 下载最新的 Sui 二进制文件。该二进制文件适用于 macOS、Linux 和 Windows。

### 使用 Homebrew 安装（MacOS）

可以使用 [Homebrew](https://brew.sh/) 包管理器安装 Sui。

```bash
brew install sui
```

### 使用 Cargo 构建（MacOS，Linux）

可以使用 Cargo 包管理器在本地安装和构建 Sui（需要 Rust）

```bash
cargo install --git https://github.com/MystenLabs/sui.git sui --branch mainnet
```

如果想使用 `testnet` 或 `devnet`，请将上述命令中的分支目标改为相应的分支。

确保系统拥有最新的 Rust 版本，可以使用以下命令：

```bash
rustup update stable
```

## 配置 IDE

有多种编辑器和 IDE 可供 Move 开发使用，以 VSCode 为例：

- [VSCode](https://code.visualstudio.com/) 是微软提供的免费开源 IDE。
- [Move 扩展](https://marketplace.visualstudio.com/items?itemName=mysten.move) 是由 Mysten Labs 维护的 Move 语言服务器扩展。
- [Move Formatter](https://marketplace.visualstudio.com/items?itemName=mysten.prettier-move) - 由 Mysten Labs 开发和维护的 Move 代码格式化工具。
- [Move Syntax](https://marketplace.visualstudio.com/items?itemName=damirka.move-syntax) 由 Damir Shamanaev 开发的简单 Move 语法高亮扩展。

## 验证安装

安装完成后，可以通过运行以下命令来验证 Sui 是否正确安装：

```bash
sui --version
```

这个命令应该会显示安装的 Sui 版本。

## 下一步

现在已经设置好了开发环境，可以开始学习编写第一个 Move 程序了！

## 参考

- [官方文档：安装 Sui](https://docs.sui.io/guides/developer/getting-started/sui-install)
- [move-book：安装 Sui](https://move-book.com/before-we-begin/install-sui.html)
- [move-book：设置 IDE](https://move-book.com/before-we-begin/ide-support.html)
