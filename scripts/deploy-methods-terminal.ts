/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, run, network } from 'hardhat';
import {
  Passport,
  Alien,
  RMRKCatalogImpl,
  RMRKBulkWriter,
  RMRKCatalogUtils,
  RMRKCollectionUtils,
  RMRKEquipRenderUtils,
  MintAlien
} from 'typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';
import env from '../src/config';
import { COLLECTION_IMAGE_MOONER,COLLECTION_IMAGE_PASSPORT } from './constants';

export async function deployPassport(catalogAddress:string): Promise<{
  contract: Passport;
  contractAddress: string;
  deploymentCost:number
}> 
{

  console.log("\n-- PASSPORT --\n")
  
  const contractFactory = await ethers.getContractFactory('Passport');
  const args = [
    COLLECTION_IMAGE_PASSPORT,
    ethers.MaxUint256,
    200,
    catalogAddress
  ] as const;

  const contract = await contractFactory.deploy(...args) as unknown as Passport;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`\nPassport deployedto -> ${contractAddress}\n\n`);

  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost)
  }

  if (!isHardhatNetwork()) {
    console.log('Waiting 60 seconds before verifying contract...');
    await delay(60000);

    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/equippable/Passport.sol:Passport',
    });

    if(network.name != 'moonbeam'){

      const registry = await getRegistry();
      await registry.addExternalCollection(contractAddress, args[0]);
      console.log('Collection added to Singular Registry ');

    }
  }

  console.log('\n====================\n\n')

  return {
    contract:contract,
    contractAddress:contractAddress,
    deploymentCost:deploymentCost
  };
}

export async function deployAlien(passaportAddress:string): Promise<{
  contract: Alien;
  contractAddress: string;
  deploymentCost:number;
}>  {

  const [deployer] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory('Alien');
  const args = [
    COLLECTION_IMAGE_MOONER,
    10000n,
    200,
    passaportAddress
  ] as const;

  const contract = await contractFactory.deploy(...args) as unknown as Alien;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`\nAlien deployed to -> ${contractAddress}\n\n`);

  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost)
  }

  if (!isHardhatNetwork() || !env.DEVELOPMENT) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(60000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/equippable/Alien.sol:Alien',
    });

    // Only do on testing, or if whitelisted for production

    if(network.name != 'moonbeam'){

      const registry = await getRegistry();
      await registry.addExternalCollection(contractAddress, args[0]);
      console.log('Collection added to Singular Registry ');

    }

    console.log('\n====================\n\n')

  }
  return {
    contract:contract,
    contractAddress:contractAddress,
    deploymentCost:deploymentCost
  };
}

export async function deployMintAlien():Promise<{
  contract: MintAlien;
  contractAddress: string;
  deploymentCost:number;
}> {

  const contractFactory = await ethers.getContractFactory('MintAlien');

  const contract = await contractFactory.deploy() as unknown as MintAlien;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`MintAlien deployed to -> ${contractAddress}\n\n`);

  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost,'\n')
  }

  if (!isHardhatNetwork() || !env.DEVELOPMENT) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(60000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
      contract: 'contracts/mintAlien/MintAlien.sol:MintAlien',
    });

    console.log('Collection added to Singular Registry \n====================\n\n');
  }

  return {
    contract:contract,
    contractAddress:contractAddress,
    deploymentCost:deploymentCost
  };
}

export async function deployCatalog(
  catalogMetadataUri: string,
  catalogType: string,
):Promise<{
  contract: RMRKCatalogImpl;
  contractAddress: string;
  deploymentCost:number
}> {

  console.log(`Deploying to ${network.name} blockchain...\n`);

  console.log("\n-- CATALOG --\n")

  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog = await catalogFactory.deploy(COLLECTION_IMAGE_MOONER, catalogType) as unknown as RMRKCatalogImpl
  await catalog.waitForDeployment();

  const catalogAddress = await catalog.getAddress();
  console.log('Catalog deployed to--> ', catalogAddress,'\n');
  
  const deploymentReceipt = await catalog.deploymentTransaction()?.wait();
  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost)
  }

  await verifyIfNotHardhat(catalogAddress, [catalogMetadataUri, catalogType]);

  console.log('==================\n')

  return {
    contract:catalog,
    contractAddress:catalogAddress,
    deploymentCost:deploymentCost
  };
}

export async function deployBulkWriter(): Promise<RMRKBulkWriter> {
  const bulkWriterFactory = await ethers.getContractFactory('RMRKBulkWriter');
  const bulkWriter = await bulkWriterFactory.deploy() as unknown as RMRKBulkWriter
  await bulkWriter.waitForDeployment();
  const bulkWriterAddress = await bulkWriter.getAddress();
  console.log('Bulk Writer deployed to:', bulkWriterAddress);

  await verifyIfNotHardhat(bulkWriterAddress);
  return bulkWriter;
}

export async function deployCatalogUtils(): Promise<RMRKCatalogUtils> {
  const catalogUtilsFactory = await ethers.getContractFactory('RMRKCatalogUtils') 
  const catalogUtils = await catalogUtilsFactory.deploy() as unknown as RMRKCatalogUtils
  await catalogUtils.waitForDeployment();
  const catalogUtilsAddress = await catalogUtils.getAddress();
  console.log('Catalog Utils deployed to:', catalogUtilsAddress);

  await verifyIfNotHardhat(catalogUtilsAddress);
  return catalogUtils;
}

export async function deployCollectionUtils(): Promise<RMRKCollectionUtils> {
  const collectionUtilsFactory = await ethers.getContractFactory('RMRKCollectionUtils');
  const collectionUtils = await collectionUtilsFactory.deploy() as unknown as RMRKCollectionUtils
  await collectionUtils.waitForDeployment();
  const collectionUtilsAddress = await collectionUtils.getAddress();
  console.log('Collection Utils deployed to:', collectionUtilsAddress);

  await verifyIfNotHardhat(collectionUtilsAddress);
  return collectionUtils;
}

export async function deployRenderUtils(): Promise<RMRKEquipRenderUtils> {
  const renderUtilsFactory = await ethers.getContractFactory('RMRKEquipRenderUtils');
  const renderUtils = await renderUtilsFactory.deploy() as unknown as RMRKEquipRenderUtils
  await renderUtils.waitForDeployment();
  const renderUtilsAddress = await renderUtils.getAddress();
  console.log('Equip Render Utils deployed to:', renderUtilsAddress);

  await verifyIfNotHardhat(renderUtilsAddress);
  return renderUtils;
}

async function verifyIfNotHardhat(contractAddress: string, args: any[] = []) {
  if (isHardhatNetwork()) {
    // Hardhat
    return;
  }

  // sleep 10s
  delay(10000);

  console.log('Etherscan contract verification starting now.');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    // probably already verified
  }


}