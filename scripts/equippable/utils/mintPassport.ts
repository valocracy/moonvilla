/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Passport,
} from '../../../typechain-types';
import * as C from '../../constants';
import {signature} from './signature'
import env from '../../../src/config';
import {provider} from '../../../src/loaders/provider';
import passport from '../../../artifacts/contracts/equippable/Passport.sol/Passport.json';
import { ethers } from 'ethers';

type PassportMetadata = {
  username:string;
  discord:string;
  twitter:string;
};

const metadata:PassportMetadata = {
  username:"RaeII",
  discord:"@Rael",
  twitter:"@Porrael"
}

//ipfs://QmaDAtdy7h2JyGYe3AYUcfe3u6wDbJA6P6T6mBtfYiTmPL/json/catalog/passport/passport1.json
export async function mintPassport(ipfsPassport: string,slotFixed:string|number) {

  const ipfsProvisoreId ='ipfs://QmSbbmFyQrqrW33Q73aoDo3dvZqVbmxFzaPpdvoawTo6hc' 

  console.log('PASSPORT ADDRESS',env.PASSPORT_CONTRACT_ADDRESS)

  const tokenURIPassport1 = ipfsPassport

  const wallet = new ethers.Wallet("cf4694c6f3cb10bbdb493c92ea61335ccb1d78035f611638a5fc60b230646474", provider);
  const tokenURIaSignature = await signature(tokenURIPassport1,wallet.address,slotFixed)

  const passportContract : Passport = new ethers.Contract(env.PASSPORT_CONTRACT_ADDRESS, passport.abi,wallet) as unknown as Passport;

  try {

    let tx = await passportContract.mintWithEquippableAsset(
      tokenURIPassport1, // TokenURI
      slotFixed,
      tokenURIaSignature
    );

    await tx.wait();
    
	} catch (error:any) {
    // console.error("Erro detalhado:", error);
    if (error instanceof Error) {
      // console.error("Erro detalhado:", error.message);
    
      // Se o erro for do tipo ethers.errors.TransactionError, podemos tentar decodificar
      if ('data' in error) {
        
        try {
          const decodedError = passportContract.interface.parseError(String(error.data));
          console.log("Erro decodificado:", decodedError);
        } catch (decodeError) {
          console.log("Não foi possível decodificar o erro:", decodeError);
        }
      }
    } else {
      console.error("Ocorreu um erro desconhecido:", error);
    }
  
  }


  
    // tx = await passport.mintWithEquippableAsset(
    //   mintTo, // To
    //   `$${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport2.json`, // TokenURI
    //   C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    //   catalogAddress, // Catalog address
    //   `$${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport02.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    //   [
    //     C.PASSPORT_V2_FIXED_PART_ID,
    //     C.ALIEN_SLOT_PART_ID,
    //   ],
    //   passportMetadaOther
    // );
    // await tx.wait();
    // tx = await passport.mintWithEquippableAsset(
    //   mintTo, // To
    //   `${C.BASE_IPFS_URI}/passport/full/3.json`, // TokenURI
    //   C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    //   catalogAddress, // Catalog address
    //   `${C.BASE_IPFS_URI}/passport/full/3.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    //   [
    //     // Fixed and slots part ids:
    //     C.CHUNKY_V3_HEAD_FIXED_PART_ID,
    //     C.CHUNKY_V3_BODY_FIXED_PART_ID,
    //     C.CHUNKY_V3_HANDS_FIXED_PART_ID,
    //     C.ALIEN_SLOT_PART_ID,
    //   ],
    // );
    // await tx.wait();
    // tx = await passport.mintWithEquippableAsset(
    //   mintTo, // To
    //   `${C.BASE_IPFS_URI}/passport/full/4.json`, // TokenURI
    //   C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    //   catalogAddress, // Catalog address
    //   `${C.BASE_IPFS_URI}/passport/full/4.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    //   [
    //     // Fixed and slots part ids:
    //     C.CHUNKY_V4_HEAD_FIXED_PART_ID,
    //     C.CHUNKY_V3_BODY_FIXED_PART_ID,
    //     C.CHUNKY_V3_HANDS_FIXED_PART_ID,
    //     C.ALIEN_SLOT_PART_ID,
    //   ],
    // );
    // await tx.wait();
    // tx = await passport.mintWithEquippableAsset(
    //   mintTo, // To
    //   `${C.BASE_IPFS_URI}/passport/full/5.json`, // TokenURI
    //   C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    //   catalogAddress, // Catalog address
    //   `${C.BASE_IPFS_URI}/passport/full/5.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
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