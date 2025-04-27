module hello_world::hello;

use sui::event;

public struct SayHello has copy, drop {
    author: address,
}

fun init(_ctx: &mut TxContext) {}

public entry fun say_hello(ctx: &mut TxContext) {
    event::emit(SayHello {
        author: tx_context::sender(ctx),
    });
}

#[test_only]
/// Test-only initialization function
public fun test_init(ctx: &mut TxContext) {
    init(ctx);
}
