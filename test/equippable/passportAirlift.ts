/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ethers,network } from "hardhat";
import { Erc721 } from "../../typechain-types";
import erc721 from "../../artifacts/contracts/equippable/Passport.sol/Passport.json"
import { wallet } from "../../src/loaders/provider";
 

describe("AIRLYFT\n\n", function () {

  before(async function () {

    console.log(`Execute in Network ${network.name}\n\n`)

    const contractAddress = "0x1bc5c430125EC93cdEa481938A7F90981e30140c"
    const contractInstance = new ethers.Contract(contractAddress, erc721.abi, wallet) as unknown as Erc721;

    const userAddress = "0x41dbAFA3d31160a88Bf60e43CCdAF3a374f610db"

    try {

      const balance = await contractInstance.balanceOf(userAddress);
     
      if (balance > 0) {
        console.log("Usuário completou a campanha!");
      
      } else {
        console.log("Usuário não completou a campanha!");
      }
      
      return ethers.formatEther(balance);
    
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  
  });

  it("OWNER PASSAPORT ID", async function () {
    console.log("\n===================  \n\n")

  });

});

