/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alien,
} from '../../../typechain-types';
import * as C from '../../constants';

export async function nestMintWithAssets(alien:Alien,passportAddress: string,catalogAddress:string ) {

  let tx = await alien.nestMintWithAssets(
    passportAddress,
    1,
    `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien01.json`,
    C.ALIEN_EQUIPPABLE_GROUP,
    C.ALIEN_SLOT_PART_ID,
    catalogAddress,
    []
  )

  // address passportAddress,
  // uint256 destinationId,
  // string memory tokenURI,
  // uint64 equippableGroupId,
  // uint64 equippableSlotPartId,
  // address catalogAddress,
  // uint64[] memory partIds
  
  await tx.wait()
  
}