module my_token::my_token;

use sui::coin::{Self, TreasuryCap};
use sui::event;

// Token identifier struct, the name is consistent with the module name but all uppercase
public struct MY_TOKEN has drop {}

public struct Minted has copy, drop {
    amount: u64,
    recipient: address,
}

// Initialization function
fun init(witness: MY_TOKEN, ctx: &mut TxContext) {
    // Create token
    // Parameters: witness, decimal places, symbol, name, description, icon URL, context
    let (treasury, metadata) = coin::create_currency(
        witness,
        9, // Decimal places (9 places commonly used for cryptocurrencies)
        b"MTK", // Symbol
        b"My Token", // Name
        b"This is my first token on Sui blockchain", // Description
        option::none(), // Icon URL
        ctx,
    );

    // Freeze metadata object to prevent future modifications
    transfer::public_freeze_object(metadata);

    // Transfer the token minting authority (Treasury Cap) to the creator
    transfer::public_transfer(treasury, tx_context::sender(ctx));
}

// Function to mint tokens
public fun mint(
    treasury_cap: &mut TreasuryCap<MY_TOKEN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient);

    event::emit(Minted {
        amount,
        recipient,
    });
}

// Function to burn tokens
public fun burn(treasury_cap: &mut TreasuryCap<MY_TOKEN>, coin: coin::Coin<MY_TOKEN>) {
    coin::burn(treasury_cap, coin);
}

// For testing only: initializes the coin
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(MY_TOKEN {}, ctx)
}
