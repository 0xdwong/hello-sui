#[test_only]
module chore::chore_tests;

use chore::chore;
use memo::memo::{Self, MemoBoard};
use std::string;
use sui::clock;
use sui::test_scenario as ts;

#[test]
fun test_post_message() {
    // Create a test address
    let user = @0xA1;

    // Start the test scenario with the test address
    let mut scenario_val = ts::begin(user);
    let scenario = &mut scenario_val;

    // Initialize memo module
    {
        memo::test_init(ts::ctx(scenario));
    };

    // Post a message
    ts::next_tx(scenario, user);
    {
        let mut board = ts::take_shared<MemoBoard>(scenario);

        let clock = clock::create_for_testing(ts::ctx(scenario));
        let ctx = ts::ctx(scenario);

        let test_message = b"Test message from chore module";
        chore::post_message_to_memo(&mut board, test_message, &clock, ctx);

        // Verify message was posted (message count should be 1)
        assert!(memo::message_count(&board) == 1, 0);

        // Get the message and verify its content
        let (content, author, _) = memo::get_message(&board, 0);
        assert!(string::utf8(test_message) == content, 1);
        assert!(author == user, 2);

        ts::return_shared(board);
        clock::destroy_for_testing(clock);
    };

    ts::end(scenario_val);
}
