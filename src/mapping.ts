import { BigInt, BigDecimal, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts';

import { TheWellNFT } from "../generated/schema";
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
    log.debug('Log by Tolu: Block number: {}, block hash: {}, transaction hash: {}', [
        event.block.number.toString(), // "47596000"
        event.block.hash.toHexString(), // "0x..."
        event.transaction.hash.toHexString(), // "0x..."
    ])
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let nft = new TheWellNFT(event.params._tokenID.toHex())

    // Set content Hash and URI
    let contract = TheWellNFTContract.bind(event.address)
    nft.contentHash = event.params._tokenURI;
    nft.contentURI = contract.tokenURI(event.params._tokenID);

    nft.creators = event.params._creators as Bytes[];

    nft.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handlePayeeAdded(event: PayeeAdded): void {}

export function handlePaymentReceived(event: PaymentReceived): void {}

export function handlePaymentReleased(event: PaymentReleased): void {}

export function handleTokenPrice(event: TokenPrice): void {}

export function handleTransfer(event: Transfer): void {}
