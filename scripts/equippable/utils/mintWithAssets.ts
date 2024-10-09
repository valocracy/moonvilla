/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alien,
} from '../../../typechain-types';
import * as C from '../../constants';

//ipfs://QmaDTsLdrTGxVM9z27f3E8wDRoJ7Poj2ZxSssFEFiE25B8/json/aliens/10.json
export async function mintWithAssets(alien:Alien,passportAddress:string, to: string,catalogAddress:string ) {
  
  let tx = await alien.mintWithAssets(
    to,
    `${C.ALIEN_BASE_IPFS_URI}/mooner/1.json`,
    C.ALIEN_SLOT_PART_ID,
    catalogAddress,
    []
  )
  
  await tx.wait()
  
}