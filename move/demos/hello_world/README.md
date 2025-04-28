# Hello World Smart Contract

## Project Introduction

This is a simple "Hello World" smart contract example based on Sui Move. The contract allows users to send a "Hello" event, which is a basic example for learning Sui Move programming.

## Contract Features

The contract mainly implements the following functions:

1. Defines a `SayHello` event structure containing the sender's address
2. Provides a `say_hello` entry function that allows users to trigger an event containing their address

## Contract Structure

- `hello.move`: Contains the main code of the contract, defines the event structure and interaction functions
- `tests/hello_tests.move`: Contains test code for the contract

## Technical Details

### Event Structure

```move
public struct SayHello has copy, drop {
    author: address,
}
```

- The `SayHello` event structure stores the address of the user who triggered the event
- This structure has `copy` and `drop` abilities, allowing values of this type to be copied and discarded

### Entry Function

```move
public entry fun say_hello(ctx: &mut TxContext) {
    event::emit(SayHello {
        author: tx_context::sender(ctx),
    });
}
```

- The `say_hello` function allows users to send an event
- The event contains the sender's address information

## How to Use

1. Make sure the Sui development environment is installed
2. Compile the contract: `sui move build`
3. Test the contract: `sui move test`
4. Deploy the contract: `sui client publish`
5. Call the entry function: `sui client call --function say_hello --module hello --package <PACKAGE_ID> --gas-budget 10000000`

## Testing

The project includes basic test cases that verify the core functionality of the contract. You can run the tests by executing `sui move test`.
