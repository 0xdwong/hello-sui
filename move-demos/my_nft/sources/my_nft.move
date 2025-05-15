module my_nft::my_nft;

use std::string;
use sui::event;
use sui::url::{Self, Url};

// A basic NFT that can be minted by anyone
public struct MYNFT has key, store {
    id: UID,
    // Name of the NFT
    name: string::String,
    // Description of the NFT
    description: string::String,
    // URL pointing to the NFT's content
    url: Url,
}

// ===== Events =====

// Event emitted when an NFT is minted
public struct NFTMinted has copy, drop {
    // The Object ID of the NFT
    object_id: ID,
    // The creator of the NFT
    creator: address,
    // The name of the NFT
    name: string::String,
}

// ===== Public view functions =====

// Get the NFT's `name`
public fun name(nft: &MYNFT): &string::String {
    &nft.name
}

// Get the NFT's `description`
public fun description(nft: &MYNFT): &string::String {
    &nft.description
}

// Get the NFT's `url`
public fun url(nft: &MYNFT): &Url {
    &nft.url
}

// ===== Entrypoints =====

#[allow(lint(self_transfer))]
// Create a new NFT and transfer it to the sender
public fun mint_to_sender(
    name: vector<u8>,
    description: vector<u8>,
    url: vector<u8>,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);
    let nft = MYNFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        url: url::new_unsafe_from_bytes(url),
    };

    event::emit(NFTMinted {
        object_id: object::id(&nft),
        creator: sender,
        name: nft.name,
    });

    transfer::public_transfer(nft, sender);
}

// Transfer `nft` to `recipient`
public fun transfer(nft: MYNFT, recipient: address, _: &mut TxContext) {
    transfer::public_transfer(nft, recipient)
}

// Update the `description` of `nft` to `new_description`
public fun update_description(nft: &mut MYNFT, new_description: vector<u8>, _: &mut TxContext) {
    nft.description = string::utf8(new_description)
}

// Permanently delete `nft`
public fun burn(nft: MYNFT, _: &mut TxContext) {
    let MYNFT { id, name: _, description: _, url: _ } = nft;
    object::delete(id)
}
