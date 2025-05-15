#[test_only]
module my_token::my_token_tests;

use my_token::my_token::{Self, MY_TOKEN, init_for_testing};
use sui::coin::{Self, TreasuryCap, Coin};
use sui::test_scenario;

// Create test address
const ADMIN: address = @0x1;
const USER: address = @0x2;

// Test the mint functionality
#[test]
fun test_mint() {
    // First transaction to create the currency
    let mut scenario = test_scenario::begin(ADMIN);
    {
        // Call the module init function by simulating a package publish
        init_for_testing(scenario.ctx());
    };

    // Second transaction to mint tokens
    scenario.next_tx(ADMIN);
    {
        // Get the TreasuryCap that was created in the init
        let mut treasury_cap = scenario.take_from_sender<TreasuryCap<MY_TOKEN>>();

        // Mint 1000 tokens to user
        my_token::mint(&mut treasury_cap, 1000, USER, scenario.ctx());

        // Return the TreasuryCap to the admin
        scenario.return_to_sender(treasury_cap);
    };

    // Third transaction to check balance
    scenario.next_tx(USER);
    {
        // Take the coin from the recipient
        let coin = scenario.take_from_sender<Coin<MY_TOKEN>>();

        // Check the balance
        assert!(coin::value(&coin) == 1000, 0);

        // Return the coin to the user
        scenario.return_to_sender(coin);
    };

    scenario.end();
}

// Test the burn functionality
#[test]
fun test_burn() {
    // First transaction to create the currency
    let mut scenario = test_scenario::begin(ADMIN);
    {
        // Call the module init function by simulating a package publish
        init_for_testing(scenario.ctx());
    };

    // Second transaction to mint tokens
    scenario.next_tx(ADMIN);
    {
        // Get the TreasuryCap that was created in the init
        let mut treasury_cap = scenario.take_from_sender<TreasuryCap<MY_TOKEN>>();

        // Mint 1000 tokens to user
        my_token::mint(&mut treasury_cap, 1000, USER, scenario.ctx());

        // Return the TreasuryCap to the admin
        scenario.return_to_sender(treasury_cap);
    };

    // Third transaction to burn some tokens
    scenario.next_tx(USER);
    {
        // Take the coin from the user
        let mut coin = scenario.take_from_sender<Coin<MY_TOKEN>>();

        // Split the coin to burn part of it
        let coin_to_burn = coin::split(&mut coin, 400, scenario.ctx());

        // Return the remaining coin to the user
        scenario.return_to_sender(coin);

        // Take the treasury cap from admin
        scenario.next_tx(ADMIN);
        let mut treasury_cap = scenario.take_from_sender<TreasuryCap<MY_TOKEN>>();

        // Burn the tokens
        my_token::burn(&mut treasury_cap, coin_to_burn);

        // Return the treasury cap
        scenario.return_to_sender(treasury_cap);
    };

    // Fourth transaction to check the balance after burning
    scenario.next_tx(USER);
    {
        // Take the coin from the user
        let coin = scenario.take_from_sender<Coin<MY_TOKEN>>();

        // Check the balance after burning
        assert!(coin::value(&coin) == 600, 1);

        // Return the coin to the user
        scenario.return_to_sender(coin);
    };

    scenario.end();
}

#[test]
fun test_mint_event() {
    // First transaction to create the currency
    let mut scenario = test_scenario::begin(ADMIN);
    {
        // Call the module init function by simulating a package publish
        init_for_testing(scenario.ctx());
    };

    // Second transaction to mint tokens
    scenario.next_tx(ADMIN);
    {
        // Get the TreasuryCap that was created in the init
        let mut treasury_cap = scenario.take_from_sender<TreasuryCap<MY_TOKEN>>();

        // Mint 1000 tokens to user - this will emit the Minted event
        my_token::mint(&mut treasury_cap, 1000, USER, scenario.ctx());

        // Return the TreasuryCap to the admin
        scenario.return_to_sender(treasury_cap);
    };

    // Check the events
    let effects = scenario.next_tx(ADMIN);

    // Verify the number of events
    assert!(test_scenario::num_user_events(&effects) == 1, 0);

    // Get and verify the event content
    // In the Sui testing framework, we cannot directly access event content for verification
    // But we can verify that at least one event was triggered

    scenario.end();
}
