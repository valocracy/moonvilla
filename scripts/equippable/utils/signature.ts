/* eslint-disable prefer-const */
import { ethers,toBigInt } from 'ethers';
import { wallet } from '../../../src/loaders/provider'

export async function signature(tokenURI:string,addressOwner:string,slotFixed:string|number) {
  
  const messageHash = ethers.solidityPackedKeccak256(
    ["string","uint64","address",],
    [tokenURI, String(slotFixed),addressOwner]
  );
  const messageHashBinary = ethers.getBytes(messageHash);
  const signature = await wallet.signMessage(messageHashBinary);

  return signature
}