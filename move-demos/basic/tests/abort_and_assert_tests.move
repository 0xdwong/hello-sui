#[test_only]
module basic::test_abort_and_assert;

use basic::abort_and_assert;

#[test]
fun test_assert_is_even() {
    let result = abort_and_assert::assert_is_even(2);
    assert!(result == true, 0);
}

#[test]
#[expected_failure(abort_code = abort_and_assert::ENotEven, location = basic::abort_and_assert)]
fun test_assert_is_even2() {
    abort_and_assert::assert_is_even(3);
}

#[test]
fun test_abort_if_not_even() {
    let result = abort_and_assert::abort_if_not_even(2);
    assert!(result == true, 0);
}

#[test]
#[expected_failure(abort_code = abort_and_assert::ENotEven, location = basic::abort_and_assert)]
fun test_abort_if_not_even2() {
    abort_and_assert::abort_if_not_even(3);
}

#[test]
fun test_abort_branch() {
    let result = abort_and_assert::abort_branch(0);
    assert!(result == false, 0);
    let result = abort_and_assert::abort_branch(1);
    assert!(result == true, 0);
}

#[test]
#[expected_failure(abort_code = 42, location = basic::abort_and_assert)]
fun test_abort_branch2() {
    abort_and_assert::abort_branch(2);
}