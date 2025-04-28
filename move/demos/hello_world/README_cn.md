# Hello World 智能合约

## 项目简介

这是一个基于 Sui Move 的简单"Hello World"智能合约示例。该合约允许用户发送一个"Hello"事件，这是学习 Sui Move 编程的基础示例。

## 合约功能

合约主要实现了以下功能：

1. 定义了一个包含发送者地址的`SayHello`事件结构
2. 提供了一个`say_hello`入口函数，允许用户触发一个包含其地址的事件

## 合约结构

- `hello.move`: 包含合约的主要代码，定义了事件结构和交互函数
- `tests/hello_tests.move`: 包含合约的测试代码

## 技术细节

### 事件结构

```move
public struct SayHello has copy, drop {
    author: address,
}
```

- `SayHello`事件结构存储了触发事件的用户地址
- 该结构具有`copy`和`drop`能力，允许复制和丢弃该类型的值

### 入口函数

```move
public entry fun say_hello(ctx: &mut TxContext) {
    event::emit(SayHello {
        author: tx_context::sender(ctx),
    });
}
```

- `say_hello`函数允许用户发送一个事件
- 事件中包含了发送者的地址信息

## 如何使用

1. 确保安装了 Sui 开发环境
2. 编译合约：`sui move build`
3. 测试合约：`sui move test`
4. 部署合约：`sui client publish`
5. 调用入口函数：`sui client call --function say_hello --module hello --package <PACKAGE_ID> --gas-budget 10000000`

## 测试

项目包含基本的测试用例，验证合约的核心功能。你可以通过运行`sui move test`来执行测试。
