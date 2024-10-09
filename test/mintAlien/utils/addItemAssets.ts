import {
    Alien,
} from '../../../typechain-types';
import * as C from '../../../scripts/constants';
import { ethers } from 'hardhat';

export async function addItemAssets(alien: Alien, chunkiesAddress: string) {

  //ALIEN #1
  let tx = await alien.addEquippableAssetEntry(
    C.ALIEN_EQUIPPABLE_GROUP, // Equippable group
    ethers.ZeroAddress, // Catalog address
    `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien01.json`, // Metadata URI
    [], // Part ids, none since this is not meant to receive any equippable and it is not composed
  );
  await tx.wait();

  //ALIEN #2
  tx = await alien.addEquippableAssetEntry(
    C.ALIEN_EQUIPPABLE_GROUP, // Equippable group
    ethers.ZeroAddress, // Catalog address
    `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien02.json`, // Metadata URI
    [], // Part ids, none since this is not meant to receive any equippable and it is not composed
  );
  await tx.wait();

  //ALIEN #3
  tx = await alien.addEquippableAssetEntry(
      C.ALIEN_EQUIPPABLE_GROUP, // Equippable group
      ethers.ZeroAddress, // Catalog address
      `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien03.json`, // Metadata URI
      [], // Part ids, none since this is not meant to receive any equippable and it is not composed
  );
  await tx.wait();


    // WARNING: This is necessary to show the intention of groups of assets to be equipped into specific collection and slots. This is the reason we have equippable group ids.
    await alien.setValidParentForEquippableGroup(
      C.ALIEN_EQUIPPABLE_GROUP, //GROUP
       chunkiesAddress,
      C.ALIEN_SLOT_PART_ID, //SLOT
    );
    await alien.setValidParentForEquippableGroup(
      C.ALIEN_EQUIPPABLE_GROUP, //GROUP
      chunkiesAddress,
      C.ALIEN_SLOT_PART_ID, //SLOT
    );
}