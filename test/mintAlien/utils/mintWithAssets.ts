/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alien,
} from '../../../typechain-types';
import * as C from '../../../scripts/constants';
import { ethers } from 'ethers';

export async function mintWithAssets(alien:Alien,passportAddress:string, to: string, ) {

  let tx = await alien.mintWithAssets(
    to,
    `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien01.json`,
    C.ALIEN_EQUIPPABLE_GROUP,
    C.ALIEN_SLOT_PART_ID,
    ethers.ZeroAddress,
    passportAddress,
    []
  )
  
  await tx.wait()
  
}