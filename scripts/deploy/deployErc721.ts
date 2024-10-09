/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers,network,run } from "hardhat";
import { delay, isHardhatNetwork } from '../utils';
import {
  Dale
} from 'typechain-types';
import env from '../../src/config';

export async function deployDale() {

  // const args = [
  //   "https://ipfs.io/ipfs/Qmdh2VAa9SZ5etd9wTKunLqfcj3oYNfShJLK3CCXtDGEH1",
  //   lpContractAddress,
  //   env.USDT_CONTRACT_ADDRESS_MOOBEAM,
  //   ethers.MaxUint256
  // ] as const;

  console.log(`\n -- DALE --\n\n`);

  //contracts/flattened/Valocracy.sol:Valocracy
  const contractFactory = await ethers.getContractFactory("contracts/ERC-721/Dale.sol:Dale");
  const contract = await contractFactory.deploy();
  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  await contract.waitForDeployment();

    // Obter informações da transação de deploy
    const deployTransactionHash = await deploymentReceipt?.getBlock();
    const deployBlockNumber = await deploymentReceipt?.getTransaction();
    
    console.log('\n---- BLOCO ->',deployTransactionHash?.number,'\n');
    console.log('---- HASH ->',deployBlockNumber?.hash,'\n');
  
  const contractAddress = await contract.getAddress();
  console.log(`Valocracy deployed to --> ${contractAddress}`);

  try {

    if (!isHardhatNetwork()) {
      console.log('Waiting 60 seconds before verifying contract...');
      await delay(60000);
      await run('verify:verify', {
        address: contractAddress,
        //constructorArguments: args,
        contract: 'contracts/ERC-721/Dale.sol:Dale',
      });
    }
    
  } catch (error) {
   
    console.log('\nFALHA AO VERIFICAR DALE\n')
    console.log(error)
    console.log('\nFALHA AO VERIFICAR DALE\n')
    
  }

  console.log('\n====================\n\n')

  return contract

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

