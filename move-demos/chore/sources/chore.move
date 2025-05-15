/// Module: chore
module chore::chore;

use memo::memo::{Self, MemoBoard};
use sui::clock::Clock;

/// Post a message to the memo board
public entry fun post_message_to_memo(
    board: &mut MemoBoard,
    content: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    memo::post_message(board, content, clock, ctx);
}
