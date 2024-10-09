/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, run, network } from 'hardhat';
import {
  Chunkies,
  ChunkyItems,
  SuportInterface,
  RMRKCatalogImpl,
  RMRKBulkWriter,
  RMRKCatalogUtils,
  RMRKCollectionUtils,
  RMRKEquipRenderUtils,
  EquipRenderUtils
} from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';

// Add your deploy methods here:

const chunkiesAddress = "0x23349792E5988E34EF064d2ea1ac30f37D6aa85C"
const chunkiesItemsAddress = "0xacFFb6D141d7e03CF34A2218b044b1F3853A0F76"

export async function verifyChunkies(){
  console.log(`Verify Chunkies to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('Chunkies');
  const args = [
    'ipfs://QmaBmBJtLy1H6iEFREj4zUFKeQWa9wJizdw4bLD4bVpM8L',
    100n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    delay(60000);
    await run('verify:verify', {
      address: chunkiesAddress,
      constructorArguments: args,
      contract: 'contracts/equippable/Chunkies.sol:Chunkies',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(chunkiesAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
}

export async function verifyChunkyItems() {

 
  const args = [
    'ipfs://QmdjfAdFTnnQT9CZZBGbBNLAXVYTnstxdqJRdKp8aoBAKf',
    100n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;


  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    // delay(60000);
    // await run('verify:verify', {
    //   address: chunkiesItemsAddress,
    //   constructorArguments: args,
    //   contract: 'contracts/equippable/ChunkyItems.sol:ChunkyItems',
    // });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(chunkiesItemsAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }

}

const verify = async () => {
  //await verifyChunkies()
  await verifyChunkyItems()
}

verify().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
