#[test_only]
module hello_world::hello_tests;

use hello_world::hello;
use sui::test_scenario as ts;

const USER1: address = @0x1;

#[test]
fun test_memo() {
    let mut scenario_val = ts::begin(USER1);
    let scenario = &mut scenario_val;

    // Initialize the memo module
    {
        hello::test_init(ts::ctx(scenario));
    };

    // Test posting a message
    ts::next_tx(scenario, USER1);
    {
        hello::say_hello(ts::ctx(scenario));
    };

    ts::end(scenario_val);
}
