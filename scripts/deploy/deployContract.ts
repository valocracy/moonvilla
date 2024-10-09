/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, network,run } from 'hardhat';
import { Address } from 'cluster';
import { LpValocracy } from "../../typechain-types";
import { delay, isHardhatNetwork } from '../utils';

async function deployContract(amount:number|undefined, contractName:string) {

  const contractFactory = await ethers.getContractFactory(contractName);

  const args = [amount] as const;
  const contract =  amount ? await contractFactory.deploy(...args) : await contractFactory.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`${contractName} deployed to --> ${contractAddress}`);


    console.log('Waiting 60 seconds before verifying contract...');
    await delay(60000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: `contracts/${contractName}.sol:${contractName}`,
    });



  return contract;
  
}

export{
  deployContract
}
