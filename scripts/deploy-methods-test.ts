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
import {ALIEN_BASE_IPFS_URI} from "./constants"


// Add your deploy methods here:

export async function deployPassport(catalogAddress:string): Promise<Passport> {

  console.log(`Deploying Passport to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('Passport');
  const args = [
    `${ALIEN_BASE_IPFS_URI}/passport-collection.json`,
    ethers.MaxUint256,
    2,
    catalogAddress
  ] as const;

  console.log(`Deploying Passport to ${network.name} blockchain...`);

  const contract = await contractFactory.deploy(...args) as unknown as Passport;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`Passport deployed to ${contractAddress}\n-`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(60000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/equippable/Passport.sol:Passport',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry \n-----------------\n');
  }
  return contract;
}

export async function deployAlien(passortAddress:string): Promise<Alien> {

  const contractFactory = await ethers.getContractFactory('Alien');
  const args = [
    `${ALIEN_BASE_IPFS_URI}/alien-collection.json`,
    10000n,
    2,
    passortAddress
  ] as const;

  const contract = await contractFactory.deploy(...args) as unknown as Alien;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`Alien deployed to ${contractAddress}\n-`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(60000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/equippable/Alien.sol:Alien',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry \n-----------------\n');
  }
  return contract;
}

export async function deployMintAlien(): Promise<MintAlien> {
  console.log(`Deploying MintAlien to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('MintAlien');

  const contract = await contractFactory.deploy() as unknown as MintAlien;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`MintAlien deployed to ${contractAddress}\n-`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(60000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
      contract: 'contracts/mintAlien/MintAlien.sol:MintAlien',
    });

    console.log('Contrato verificado com sucesso! \n-----------------\n');
  }
  return contract;
}

export async function deployCatalog(
  catalogType: string,
): Promise<RMRKCatalogImpl> {

  const catalogMetadataUri = `${ALIEN_BASE_IPFS_URI}/passport-collection.json`

  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog = await catalogFactory.deploy(catalogMetadataUri, catalogType) as unknown as RMRKCatalogImpl
  await catalog.waitForDeployment();
  const catalogAddress = await catalog.getAddress();
  console.log('Catalog deployed to:', catalogAddress,'\n-');

  await verifyIfNotHardhat(catalogAddress, [catalogMetadataUri, catalogType]);
  return catalog;
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