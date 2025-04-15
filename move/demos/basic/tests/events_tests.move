#[test_only]
module basic::test_events;

use basic::events;

#[test]
fun test_case_1() {
    events::say_hi(&mut tx_context::dummy());
}