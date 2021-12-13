import { BigInt, BigDecimal, Bytes, Address, ethereum } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts';

import { findOrCreateUser } from './helpers';
import { NFT, User } from "../generated/schema";

import {
    UpdateSubgraph,
    SubgraphUpdater as SubgraphUpdaterContract 
} from "../generated/SubgraphUpdater/SubgraphUpdater"

import { TheWellNFT as TheWellNFTContract } from "../generated/TheWellNFT/TheWellNFT";

export function handleUpdate(event: UpdateSubgraph): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    if(event.params.message == 'tokenBaseURI updated') {
        // loop through nfts
        let tokenExists = true;

        let tokenID = 1;

        while(tokenExists) {
            const idStr:BigInt = BigInt.fromI32(tokenID);
            const nft = new NFT(tokenID.toString())
            // Set content Hash and URI
            let contract = TheWellNFTContract.bind(event.address)

            nft.mediaURI = contract.tokenMediaURI(idStr);
            nft.metadataURI = contract.tokenURI(idStr);

            nft.save()
            tokenID++;
        }
    }
}
