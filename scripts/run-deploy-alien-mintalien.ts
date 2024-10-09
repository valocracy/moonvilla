/* eslint-disable @typescript-eslint/no-unused-vars */
import { deployPassport, deployAlien,deployMintAlien,deployCatalog } from './deploy-methods-terminal';
 
async function main() {
  
  const catalog = await deployCatalog("ipfs","image/*")
  const passport = await deployPassport(catalog.contractAddress)
  await deployAlien(passport.contractAddress)
  await deployMintAlien()
  
}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});