#[test_only]
module basic::test_numbers;

use basic::numbers;

#[test]
fun test_overflow_is_ok() {
    let result = numbers::overflow_is_ok(&mut tx_context::dummy());
    assert!(result == 252, 0);
}

#[test]
#[expected_failure(arithmetic_error, location = numbers)]
fun test_overflow_is_not_ok() {
    let _ = numbers::overflow_is_not_ok(&mut tx_context::dummy());
}
