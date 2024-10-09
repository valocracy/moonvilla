/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RMRKCatalogImpl,
} from '../../../typechain-types';

import * as C from '../../../scripts/constants';
import gasService from '../../../src/services/gas.service';

export async function configureCatalog(catalog: RMRKCatalogImpl, moonerAddress: string, ipfsPassport: string, slot:string|number) {
  
  console.log({moonerAddress})

  const tx = await catalog.addPartList([
    /**
     * NOSSO CATALOGO VAI TER 1 SLOT EQUIPAVEL, QUE SERÁ O LUGARZINHO DO ALIEN
     */
    //ipfs://QmSbbmFyQrqrW33Q73aoDo3dvZqVbmxFzaPpdvoawTo6hc/json/catalog/passport/passport1.json

    {
      partId: C.ALIEN_SLOT_PART_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.Z_INDEX_HAND_ITEMS,
        equippable: [moonerAddress],
        metadataURI: C.CATALOG_SLOT_NAME_MOONER,//	name	"Left Hand"
      },
    },
    // {
    //   partId: slot,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HEAD,
    //     equippable: [],
    //     metadataURI: ipfsPassport,
    //   },
    // },
  //   {
  //     partId: C.PASSPORT_V2_FIXED_PART_ID,
  //     part: {
  //       itemType: C.PART_TYPE_FIXED,
  //       z: 0,
  //       equippable: [],
  //       metadataURI: `${ipfsProvisoreId}/json/catalog/passport/passport02.json`,
  //     },
  //  },
    // {
    //   partId: C.CHUNKY_V1_HANDS_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HANDS,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v1/hand.json`,
    //     //https://gateway.pinata.cloud/ipfs/QmWHfjuK256s9hyTzjbVH6BvkTBP1AAwnAJANJkhzNKW8y/chunkies/parts/v1/hand.svg
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V2_HEAD_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HEAD,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v2/head.json`,
    //     //https://gateway.pinata.cloud/ipfs/QmWHfjuK256s9hyTzjbVH6BvkTBP1AAwnAJANJkhzNKW8y/chunkies/parts/v2/head.svg
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V2_BODY_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_BODY,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v2/body.json`,
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V2_HANDS_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HANDS,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v2/hand.json`,
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V3_HEAD_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HEAD,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v3/head.json`,
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V3_BODY_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_BODY,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v3/body.json`,
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V3_HANDS_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HANDS,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v3/hand.json`,
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V4_HEAD_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HEAD,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v4/head.json`,
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V4_BODY_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_BODY,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v4/body.json`,
    //   },
    // },
    // {
    //   partId: C.CHUNKY_V4_HANDS_FIXED_PART_ID,
    //   part: {
    //     itemType: C.PART_TYPE_FIXED,
    //     z: C.Z_INDEX_HANDS,
    //     equippable: [],
    //     metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v4/hand.json`,
    //   },
    // },
  ]);

  const receipt = await tx.wait();
  const actualCost = gasService.transactionGasCost(receipt)

  return actualCost
}