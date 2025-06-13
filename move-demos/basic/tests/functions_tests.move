#[test_only]
module basic::call_functions;

use basic::functions;

#[test]
fun test_call_module_only_func_should_failed(): u64 {
    // functions::allow_in_module() // invalid
    1
}

#[test]
fun test_call_package_func_should_success(): u64 {
    functions::allow_in_package()
}
