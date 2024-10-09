/* eslint-disable @typescript-eslint/no-unused-vars */
import { deployPassport, deployAlien,deployMintAlien,deployCatalog } from './deploy-methods-terminal';
 
async function main() {
  
  const catalog = await deployCatalog("ipfs","image/*")
  const passport = await deployPassport(catalog.contractAddress)
  const alien = await deployAlien(passport.contractAddress)
  const mintAlien = await deployMintAlien()
  
  const totalDeployCost = catalog.deploymentCost + passport.deploymentCost + alien.deploymentCost + mintAlien.deploymentCost

  console.log('\nTOTAL COST DEPLOY ->',totalDeployCost)
}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});