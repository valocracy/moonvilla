/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, network } from 'hardhat';
import { Passport, Alien, RMRKCatalogImpl } from '../../typechain-types';
import env from '../../src/config';
 
const PASSPORT_ADDRESS_HARDHAT = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const ALIEN_ITEMS_ADDRESS_HARDHAT = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const CATALOG_ADDRESS_HARDHAT = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
 
const PASSPORT_ADDRESS_PROD = env.PASSPORT_CONTRACT_ADDRESS;
const ALIEN_ITEMS_ADDRESS_PROD = env.ALIEN_CONTRACT_ADDRESS;
const CATALOG_ADDRESS_PROD = env.CATALOG_CONTRACT_ADDRESS;
 
export default async function getDeployedContracts(): Promise<{
  passport: Passport;
  alien: Alien;
  catalog: RMRKCatalogImpl;
}> {

  console.log("\nnetwork name",network.name,"\n")
  
  const chunkiesAddress = ['hardhat', 'localhost'].includes(network.name)
    ? PASSPORT_ADDRESS_HARDHAT
    : PASSPORT_ADDRESS_PROD;
  const chunkiesFactory = await ethers.getContractFactory('Passport');
  const passport = <Passport>chunkiesFactory.attach(chunkiesAddress);
  
  const chunkyItemsAddress = ['hardhat', 'localhost'].includes(network.name)
    ? ALIEN_ITEMS_ADDRESS_HARDHAT
    : ALIEN_ITEMS_ADDRESS_PROD;
  const chunkyItemsFactory = await ethers.getContractFactory('Alien');
  const alien = <Alien>chunkyItemsFactory.attach(chunkyItemsAddress);
 
  const catalogAddress = ['hardhat', 'localhost'].includes(network.name)
    ? CATALOG_ADDRESS_HARDHAT
    : CATALOG_ADDRESS_PROD;
  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog = <RMRKCatalogImpl>catalogFactory.attach(catalogAddress);
 
  return {
    passport,
    alien,
    catalog
  };
}