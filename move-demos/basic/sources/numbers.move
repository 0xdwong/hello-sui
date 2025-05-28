module basic::numbers;

public fun overflow_is_ok(_ctx: &mut TxContext): u8 {
    let x: u8 = 255;
    let y: u8 = x << 2;
    y
}

public fun overflow_is_not_ok(_ctx: &mut TxContext): u8 {
    let x: u8 = 255;
    let y: u8 = x * 2; // +/*/pow
    y
}
