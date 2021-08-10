import { BigInt, BigDecimal, Bytes, Address, ethereum } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts';

import { findOrCreateUser } from './helpers';
import { NFT, User } from "../generated/schema";

import {
    Approval,
    ApprovalForAll,
    MintNFT,
    PayeeAdded,
    PaymentReceived,
    PaymentReleased,
    TokenPrice,
    Transfer,
    TheWellNFT as TheWellNFTContract 
} from "../generated/TheWellNFT/TheWellNFT"


export function handleMintNFT(event: MintNFT): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let nft = new NFT(event.params._tokenID.toHex())

    // Set content Hash and URI
    let contract = TheWellNFTContract.bind(event.address)
    nft.mediaHash = event.params._contentHash;
    nft.mediaURI = contract.tokenURI(event.params._tokenID);

    nft.metadataHash = contract.tokenURI(event.params._tokenID);
    nft.metadataURI = contract.tokenURI(event.params._tokenID);

    let creatorArr = <string[]>[];

    let a: Array<Address> = event.params._creators;

    for(let i = 0; i < a.length; i++) {

        let c: User = findOrCreateUser(
            a[i].toHexString()
        );

        creatorArr.push(c.id);
    }

    nft.creators = creatorArr;

    nft.createdAtTimestamp = event.block.timestamp;

    nft.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handlePayeeAdded(event: PayeeAdded): void {}

export function handlePaymentReceived(event: PaymentReceived): void {}

export function handlePaymentReleased(event: PaymentReleased): void {}

export function handleTokenPrice(event: TokenPrice): void {}

export function handleTransfer(event: Transfer): void {}
