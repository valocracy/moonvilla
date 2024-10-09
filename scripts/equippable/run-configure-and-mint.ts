/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { ethers } from 'hardhat';
import getDeployedContracts from './get-deployed-contracts';
import { configureCatalog } from "./utils/configureCatalog";
import { mintPassport } from "./utils/mintPassport";
import { addItemAssets } from "./utils/addItemAssets";
import { mintItems } from "./utils/mintItems";
import { mintWithAssets } from "./utils/mintWithAssets";
import { nestMintWithAssets } from "./utils/nestMintWithAssets";
import * as C from './../../scripts/constants';

type IntakeEquip = {
  tokenId:number;
  childIndex:number;
  assetId:number;
  slotPartId:number;
  childAssetId:number;
};

function delay(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const unkip:IntakeEquip = {
  tokenId:1,
  childIndex: 0,
  assetId:1,
  slotPartId:C.ALIEN_SLOT_PART_ID,
  childAssetId:1
}
 
async function main() {
  const { passport, alien, catalog } = await getDeployedContracts();
  const [deployer] = await ethers.getSigners();
  const chunkieAddress = await passport.getAddress()
  console.log('deployer address ->',deployer.address)

  // console.log(chunkieAddress)
  // const x = await alien.nestMintWithAssets(
  //   chunkieAddress, // To
  //   1, // destinationId
  //   `${C.BASE_IPFS_URI}/items/flag/left.json`, // TokenURI,
  //   [3, 4], // Assets
  // );
  // await x.wait();

  // return

  // await bulkWriter.bulkEquip(chunkieAddress,1,[],unkip)
  // return

  //RECUPERA OS FILHOS DO TOKEN
  // const childrenOf = await passport.childrenOf(unkip.tokenId)
  // console.log({childrenOf})
  // //-- 
  
  // await passport.equip(unkip)
  // return

  // let tx = await passport.setAutoAcceptCollection(await alien.getAddress(), true);
  // await tx.wait();
  // console.log('Passaport set to auto accept Alien');

  const ipfsPassport = 'ipfs://QmZtqwNYmiecuZeqrv9Ym5WVszX6eHXrmtVn9exzondaqY5'
  const slot = '6635608674091751895'
  
  await configureCatalog(catalog, await alien.getAddress(),ipfsPassport,slot);
  console.log('Catalog configured');

  //await delay(60000);

  // // console.log(await passport.getAddress())
  
  // await mintPassport(ipfsPassport,slot);
  // console.log(`Passport minted`);

  // await mintWithAssets(alien, await passport.getAddress(), "0x466aFf4E362Ba868b82F1266b9b0AB7Bf97c3aaf",await catalog.getAddress())
  // console.log('mintWithAssets');

  // await nestMintWithAssets(alien, await passport.getAddress(), deployer.address,await catalog.getAddress())
  // console.log('mintWithAssets');
  
  // await addItemAssets(alien, await passport.getAddress());
  // console.log('Item assets added');
 
  // await mintItems(alien, await passport.getAddress());
  // console.log('Items minted into passport');



  // const txx = await passport.addAssetEntry("ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/items/bone/left.json")
  
  // const TOTAL_ASSETS = await passport.totalAssets()
  // console.log({TOTAL_ASSETS})

  // await passport.addAssetToToken(1,11,0)



}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});   