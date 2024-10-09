/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { ethers } from 'hardhat';
import getDeployedContracts from './get-deployed-contracts';
 
async function main() {
  const { suportInterface } = await getDeployedContracts();
 
  let tx = await suportInterface.getInterfaceSupport("0x5FbDB2315678afecb367f032d93F642f64180aa3")
 
  console.log('INTERFACE -->',tx);
 
}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});   