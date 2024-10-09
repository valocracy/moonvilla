/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Passport,
} from '../../../typechain-types';
import * as C from '../../../scripts/constants';

export async function mintPassport(chunkies: Passport, catalogAddress: string, mintTo: string) {
  let tx = await chunkies.mintWithEquippableAsset(
    mintTo,
    `${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport01.json`, // TokenURI
    C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    catalogAddress, // Catalog address
    `${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport01.json`, // URI de metadados, estamos usando o mesmo que tokenURI. Poderíamos usar um substituto para todos.
    [
      C.PASSPORT_V1_FIXED_PART_ID,
      C.ALIEN_SLOT_PART_ID
    ],
  );
  await tx.wait();
  // tx = await chunkies.mintWithEquippableAsset(
  //   mintTo, // To
  //   `${C.BASE_IPFS_URI}/chunkies/full/3.json`, // TokenURI
  //   C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
  //   catalogAddress, // Catalog address
  //   `${C.BASE_IPFS_URI}/chunkies/full/3.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
  //   [
  //     // Fixed and slots part ids:
  //     C.CHUNKY_V3_HEAD_FIXED_PART_ID,
  //     C.CHUNKY_V3_BODY_FIXED_PART_ID,
  //     C.CHUNKY_V3_HANDS_FIXED_PART_ID,
  //     C.ALIEN_SLOT_PART_ID,
  //   ],
  // );
  // await tx.wait();
  // tx = await chunkies.mintWithEquippableAsset(
  //   mintTo, // To
  //   `${C.BASE_IPFS_URI}/chunkies/full/4.json`, // TokenURI
  //   C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
  //   catalogAddress, // Catalog address
  //   `${C.BASE_IPFS_URI}/chunkies/full/4.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
  //   [
  //     // Fixed and slots part ids:
  //     C.CHUNKY_V4_HEAD_FIXED_PART_ID,
  //     C.CHUNKY_V3_BODY_FIXED_PART_ID,
  //     C.CHUNKY_V3_HANDS_FIXED_PART_ID,
  //     C.ALIEN_SLOT_PART_ID,
  //   ],
  // );
  // await tx.wait();
  // tx = await chunkies.mintWithEquippableAsset(
  //   mintTo, // To
  //   `${C.BASE_IPFS_URI}/chunkies/full/5.json`, // TokenURI
  //   C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
  //   catalogAddress, // Catalog address
  //   `${C.BASE_IPFS_URI}/chunkies/full/5.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
  //   [
  //     // Fixed and slots part ids:
  //     C.CHUNKY_V3_HEAD_FIXED_PART_ID,
  //     C.CHUNKY_V4_BODY_FIXED_PART_ID,
  //     C.CHUNKY_V4_HANDS_FIXED_PART_ID,
  //     C.ALIEN_SLOT_PART_ID,
  //   ],
  // );
  // await tx.wait();
}