module basic::functions;

fun allow_in_module(): u64 {
    1
}

public(package) fun allow_in_package(): u64 {
    1
}

public fun allow_oters_packages(): u64 {
    1
}

entry fun allow_entry_point(): u64 {
    1
}

public entry fun allow_entry_point_and_other_packages(): u64 {
    1
}

#[test]
fun test_call_from_this_module_should_succeed(): u64 {
    allow_in_module()
}
