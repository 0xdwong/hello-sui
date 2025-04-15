module basic::events;

use sui::event;

// 定义一个简单的问候事件
public struct SayHiEvent has copy, drop {
    message: vector<u8>,
    sender: address
}

// 发出问候事件的函数
public fun say_hi(ctx: &mut TxContext) {
    event::emit(SayHiEvent {
        message: b"Hi!",
        sender: tx_context::sender(ctx)
    });
}


