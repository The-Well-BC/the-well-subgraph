import { BigInt, BigDecimal, Bytes, Address, ethereum } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts';

import { findOrCreateUser } from './helpers';
import { NFT, User } from "../generated/schema";

import {
    Approval,
    ApprovalForAll,
    Transfer,
    TheWellNFT as TheWellNFTContract 
} from "../generated/TheWellNFT/TheWellNFT"

// changetype<TheWellNFTContract>(TheWellNFT);

export function handleNFTransfer(event: Transfer): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let tokenID = event.params.tokenId;
    let nft = new NFT(tokenID.toHex())

    // Set content Hash and URI
    let contract = TheWellNFTContract.bind(event.address)

    const zeroAddress = '0x0000000000000000000000000000000000000000';

    log.info('To Address: {}, from address: {}, zero Address: {}', [event.params.to.toHexString(), event.params.from.toHexString(), zeroAddress]);

    if(event.params.from.toHexString() == zeroAddress) {
        nft.mediaURI = contract.tokenMediaURI(tokenID);
        nft.metadataURI = contract.tokenURI(tokenID);

        let creatorArr = <string[]>[];

        let a: Array<Address> = contract.tokenCreators(tokenID);

        for(let i = 0; i < a.length; i++) {
            let c: User = findOrCreateUser(
                a[i].toHexString()
            );

            // log.debug('number of creations for creator', [c.numberOfCreations.toString()])
            c.numberOfCreations++;
            c.save()

            creatorArr.push(c.id);
        }

        nft.creators = creatorArr;

        log.debug('tokenid', [tokenID.toHexString()])
        nft.owner = event.params.to.toHexString();

        /*
    if(!nft.collectors)
        nft.collectors = <string[]>[];

    let collector: User = findOrCreateUser(event.params.to.toHexString());
    nft.collectors.push(collector.id);
         */

        nft.createdAtTimestamp = event.block.timestamp;
    }

    nft.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransfer(event: Transfer): void {}
