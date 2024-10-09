/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers,network,run } from "hardhat";
import { delay, isHardhatNetwork } from '../utils';
import { getRegistry } from '../get-gegistry';

async function deployNftTest() {

  console.log(`Deploying Valocracy to ${network.name} blockchain...`);
  const contractFactory = await ethers.getContractFactory("NftTest");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log(`Valocracy deployed to --> ${contractAddress}`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 60 seconds before verifying contract...');
    delay(60000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
      contract: 'contracts/NftTest.sol:NftTest',
    });
 
    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, "https://ipfs.io/ipfs/QmQvm8XG7EkGN9BQGmkVATsyisVWRBo5hAb1EMERg9NAGU");
    console.log('Collection added to Singular Registry');
  }

  return contract

}

deployNftTest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});