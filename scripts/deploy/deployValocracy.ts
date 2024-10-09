/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers,network,run } from "hardhat";
import { delay, isHardhatNetwork } from '../utils';
import { getRegistry } from '../get-gegistry';
import {
  Passport,
  LpValocracy,
  Valocracy,
  Test
} from 'typechain-types';
import env from '../../src/config';

export async function deployValocracy(lpContractAddress:string) {

  const args = [
    "ipfs://QmTL2h88FxDcURt5S7AF1B4rV1SRA7PHH5HZqbxvSHGYW5",
    lpContractAddress,
    env.USDT_CONTRACT_ADDRESS_MOOBEAM,
    ethers.MaxUint256
  ] as const;

  console.log(`\n -- VALOCRACY --\n\n`);

  //contracts/flattened/Valocracy.sol:Valocracy
  const contractFactory = await ethers.getContractFactory("contracts/Valocracy.sol:Valocracy");
  const contract = await contractFactory.deploy(...args) as unknown as Valocracy;
  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  await contract.waitForDeployment();

  // Obter informações da transação de deploy
  const deployTransactionHash = await deploymentReceipt?.getBlock();
  const deployBlockNumber = await deploymentReceipt?.getTransaction();
    
  console.log('\n---- BLOCO ->',deployTransactionHash?.number,'\n');
  console.log('---- HASH ->',deployBlockNumber?.hash,'\n');

  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost)
  }
    
  
  const contractAddress = await contract.getAddress();
  console.log(`Valocracy deployed to --> ${contractAddress}`);

  try {

    if (!isHardhatNetwork()) {
      console.log('Waiting 60 seconds before verifying contract...');
      await delay(60000);
      await run('verify:verify', {
        address: contractAddress,
        constructorArguments: args,
        contract: 'contracts/Valocracy.sol:Valocracy',
      });
      //contracts/flattened/Valocracy.sol:Valocracy
   
      // Only do on testing, or if whitelisted for production
      const registry = await getRegistry();
      await registry.addExternalCollection(contractAddress, args[0]);
      console.log('Collection added to Singular Registry');
    }
    
  } catch (error) {
   
    console.log('\nFALHA AO VERIFICAR VALOCRACY\n')
    console.log(error)
    console.log('\nFALHA AO VERIFICAR VALOCRACY\n')
    
  }


  console.log('\n====================\n\n')

  return contract

}

export async function deployLpPassport(): Promise<{
  contract: LpValocracy;
  contractAddress: string;
  deploymentCost:number
}> 
{

  console.log("\n-- LP VALOCRACY --\n")
  
  const contractFactory = await ethers.getContractFactory('contracts/LpValocracy.sol:LpValocracy');
  const args = [
    9999999999999999999999999999999999999999999999n,
  ] as const;

  const contract = await contractFactory.deploy(...args) as unknown as LpValocracy;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`\nLpValocracy deployed to -> ${contractAddress}\n\n`);

  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost)
  }

  try {

    if (!isHardhatNetwork()) {
      console.log('Waiting 60 seconds before verifying contract...');
      await delay(60000);
      await run('verify:verify', {
        address: contractAddress,
        constructorArguments: args,
        contract: 'contracts/LpValocracy.sol:LpValocracy',
      });
  
    }
    
  } catch (error) {

    console.log('\nFALHA AO VERIFICAR LPVALOCRACY\n')
    console.log(error)
    console.log('\nFALHA AO VERIFICAR LPVALOCRACY\n')
    
  }

  console.log('\n====================\n\n')

  return {
    contract:contract,
    contractAddress:contractAddress,
    deploymentCost:deploymentCost
  };
}

export async function verify(lpContractAddress:string,contractAddress:string) {

  const args = [
    "https://ipfs.io/ipfs/Qmdh2VAa9SZ5etd9wTKunLqfcj3oYNfShJLK3CCXtDGEH1",
    lpContractAddress,
    env.USDT_CONTRACT_ADDRESS_MOOBEAM,
    ethers.MaxUint256
  ] as const;

  
  await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/Valocracy.sol:Valocracy',
  });
 

}

export async function deployBalance() {

  console.log(`\n -- BALANCE --\n\n`);

  //contracts/flattened/Valocracy.sol:Valocracy
  const contractFactory = await ethers.getContractFactory("contracts/Balance.sol:Balance");
  const contract = await contractFactory.deploy();
  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  await contract.waitForDeployment();

    // Obter informações da transação de deploy
    const deployTransactionHash = await deploymentReceipt?.getBlock();
    const deployBlockNumber = await deploymentReceipt?.getTransaction();
    
    console.log('\n---- BLOCO ->',deployTransactionHash?.number,'\n');
    console.log('---- HASH ->',deployBlockNumber?.hash,'\n');

  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost)
  }
  
  const contractAddress = await contract.getAddress();
  console.log(`Balance deployed to --> ${contractAddress}`);

  try {

    if (!isHardhatNetwork()) {
      console.log('Waiting 60 seconds before verifying contract...');
      await delay(60000);
      await run('verify:verify', {
        address: contractAddress,
        contract: 'contracts/Balance.sol:Balance',
      });
    }
    
  } catch (error) {
   
    console.log('\nFALHA AO VERIFICAR BALANCE\n')
    console.log(error)
    console.log('\nFALHA AO VERIFICAR BALANCE\n')
    
  }


  console.log('\n====================\n\n')

  return contract

}

export async function deployTest(): Promise<{
  contract: Test;
  contractAddress: string;
  deploymentCost:number
}> 
{

  console.log("\n-- TEST --\n")
  
  const contractFactory = await ethers.getContractFactory('Test');
  const args = [
    'DALE NESSA MENSAGEM MEU AMIGO QUERIDO!',
  ] as const;

  const contract = await contractFactory.deploy() as unknown as Test;
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`\nTest deployed to -> ${contractAddress}\n\n`);

  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  // Calcula o custo do deploy
  let deploymentCost = 0;
  if(deploymentReceipt?.gasUsed && deploymentReceipt?.gasPrice){
    const gasUsed = deploymentReceipt?.gasUsed;
    const gasPrice = deploymentReceipt?.gasPrice;
    deploymentCost = Number(ethers.formatEther(gasUsed * gasPrice))

    console.log('Deployment cost:', deploymentCost)
  }

  try {

    if (!isHardhatNetwork()) {
      console.log('Waiting 60 seconds before verifying contract...');
      await delay(60000);
      await run('verify:verify', {
        address: contractAddress, 
        contract: 'contracts/Test.sol:Test',
      });
  
    }
    
  } catch (error) {

    console.log('\nTest\n')
    console.log(error)
    console.log('\nTest\n')
    
  }

  console.log('\n====================\n\n')

  return {
    contract:contract,
    contractAddress:contractAddress,
    deploymentCost:deploymentCost
  };
}
