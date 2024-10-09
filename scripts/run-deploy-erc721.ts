/* eslint-disable @typescript-eslint/no-unused-vars */
import { deployDale } from './deploy/deployErc721';
 
async function main() {
  
  await deployDale()
  
}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});