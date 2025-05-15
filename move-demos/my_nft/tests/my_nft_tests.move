#[test_only]
module my_nft::my_nft_tests;

use my_nft::my_nft::{Self, MYNFT};
use std::ascii;
use std::string;
use sui::test_scenario as ts;
use sui::url;

// Test addresses
const CREATOR: address = @0xA;
const RECIPIENT: address = @0xB;

// Test data
const NAME: vector<u8> = b"Test NFT";
const DESCRIPTION: vector<u8> = b"This is a test NFT";
const URL: vector<u8> = b"https://example.com/nft";
const NEW_DESCRIPTION: vector<u8> = b"Updated description";

// Test mint_to_sender function
#[test]
fun test_mint_to_sender() {
    // Create test scenario with CREATOR as the sender
    let mut scenario = ts::begin(CREATOR);

    // Mint an NFT
    {
        let ctx = ts::ctx(&mut scenario);
        my_nft::mint_to_sender(NAME, DESCRIPTION, URL, ctx);
    };

    // Check that the CREATOR owns the NFT
    ts::next_tx(&mut scenario, CREATOR);
    {
        let nft = ts::take_from_sender<MYNFT>(&scenario);

        // Verify NFT properties
        let name_bytes = NAME;
        let desc_bytes = DESCRIPTION;
        assert!(string::as_bytes(my_nft::name(&nft)) == name_bytes, 0);
        assert!(string::as_bytes(my_nft::description(&nft)) == desc_bytes, 1);

        // Return the NFT to the sender's inventory
        ts::return_to_sender(&scenario, nft);
    };

    ts::end(scenario);
}

// Test transfer function
#[test]
fun test_transfer() {
    let mut scenario = ts::begin(CREATOR);

    // Mint an NFT
    {
        let ctx = ts::ctx(&mut scenario);
        my_nft::mint_to_sender(NAME, DESCRIPTION, URL, ctx);
    };

    // Transfer the NFT to RECIPIENT
    ts::next_tx(&mut scenario, CREATOR);
    {
        let nft = ts::take_from_sender<MYNFT>(&scenario);
        let ctx = ts::ctx(&mut scenario);
        my_nft::transfer(nft, RECIPIENT, ctx);
    };

    // Verify that RECIPIENT now owns the NFT
    ts::next_tx(&mut scenario, RECIPIENT);
    {
        let nft = ts::take_from_sender<MYNFT>(&scenario);

        // Verify NFT properties
        let name_bytes = NAME;
        assert!(string::as_bytes(my_nft::name(&nft)) == name_bytes, 2);

        // Return the NFT to the sender's inventory
        ts::return_to_sender(&scenario, nft);
    };

    ts::end(scenario);
}

// Test update_description function
#[test]
fun test_update_description() {
    let mut scenario = ts::begin(CREATOR);

    // Mint an NFT
    {
        let ctx = ts::ctx(&mut scenario);
        my_nft::mint_to_sender(NAME, DESCRIPTION, URL, ctx);
    };

    // Update the NFT description
    ts::next_tx(&mut scenario, CREATOR);
    {
        let mut nft = ts::take_from_sender<MYNFT>(&scenario);
        let ctx = ts::ctx(&mut scenario);

        my_nft::update_description(&mut nft, NEW_DESCRIPTION, ctx);

        // Verify the description was updated
        let new_desc_bytes = NEW_DESCRIPTION;
        assert!(string::as_bytes(my_nft::description(&nft)) == new_desc_bytes, 3);

        // Return the NFT to the sender's inventory
        ts::return_to_sender(&scenario, nft);
    };

    ts::end(scenario);
}

// Test burn function
#[test]
fun test_burn() {
    let mut scenario = ts::begin(CREATOR);

    // Mint an NFT
    {
        let ctx = ts::ctx(&mut scenario);
        my_nft::mint_to_sender(NAME, DESCRIPTION, URL, ctx);
    };

    // Burn the NFT
    ts::next_tx(&mut scenario, CREATOR);
    {
        let nft = ts::take_from_sender<MYNFT>(&scenario);
        let ctx = ts::ctx(&mut scenario);

        // Burn the NFT
        my_nft::burn(nft, ctx);
    };

    // Verify the NFT no longer exists
    ts::next_tx(&mut scenario, CREATOR);
    {
        // This should return false as the object has been deleted
        assert!(!ts::has_most_recent_for_sender<MYNFT>(&scenario), 4);
    };

    ts::end(scenario);
}

// Test view functions: name(), description(), url()
#[test]
fun test_view_functions() {
    let mut scenario = ts::begin(CREATOR);

    // Mint an NFT
    {
        let ctx = ts::ctx(&mut scenario);
        my_nft::mint_to_sender(NAME, DESCRIPTION, URL, ctx);
    };

    // Test the view functions
    ts::next_tx(&mut scenario, CREATOR);
    {
        let nft = ts::take_from_sender<MYNFT>(&scenario);

        // Test name() function
        let name_str = my_nft::name(&nft);
        assert!(string::utf8(NAME) == *name_str, 0);

        // Test description() function
        let desc_str = my_nft::description(&nft);
        assert!(string::utf8(DESCRIPTION) == *desc_str, 1);

        // Test url() function
        let url_obj = my_nft::url(&nft);

        // Convert URL bytes to ASCII string and get inner string for comparison
        let expected_url_ascii = ascii::string(URL);
        assert!(url::inner_url(url_obj) == expected_url_ascii, 2);

        // Return the NFT to the sender's inventory
        ts::return_to_sender(&scenario, nft);
    };

    ts::end(scenario);
}
