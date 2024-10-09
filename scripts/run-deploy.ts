/* eslint-disable @typescript-eslint/no-unused-vars */
import { deployPassport, deployAlien,deployMintAlien,deployCatalog } from './deploy-methods';
 
async function main() {
  
  const catalog =  await deployCatalog("image/*")
  const passport = await deployPassport(catalog.contractAddress)
  const alien =  await deployAlien(passport.contractAddress)
  const mint_alien =  await deployMintAlien()
  
  return {
    passport_address:passport.contractAddress,
    alien_address:alien.contractAddress,
    mint_alien_address:mint_alien.contractAddress,
    catalog_address:catalog.contractAddress  
  }
}
 
export {main}