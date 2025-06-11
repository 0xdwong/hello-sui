module basic::abort_and_assert;

const ENotEven: u64 = 0;

public fun assert_is_even(num: u64): bool {
    assert!(num % 2 == 0, ENotEven);
    true
}

public fun abort_if_not_even(num: u64): bool {
    if (num % 2 != 0) {
        abort ENotEven
    };
    true
}

public fun abort_branch(x: u64): bool {
    if (x == 0) false
    else if (x == 1) true
    else abort 42
}
