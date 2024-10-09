/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ethers,network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Passport, Alien,RMRKCatalogImpl,Erc721 } from "../../typechain-types";
import Erc721Artifacts from "../../artifacts/contracts/ERC-721/ERC-721.sol/Erc721.json"
import { wallet } from "../../src/loaders/provider";
 

describe("EQUIPPABLE COMPOSABLE\n\n", function () {

  let ArliftContract: Erc721;
  let AlienContract:Alien;
  let Catalog: RMRKCatalogImpl;
  let OTHER_HOLDER: SignerWithAddress;
  let THIRD_HOLDER: SignerWithAddress;
  let OWNER:SignerWithAddress;
  let chunkiesAddress: string;
  let airliftAddress: string;
  let catalogAddress: string;
  let passportAddress:string;
  
  

  const twoFixed = (number:bigint,formatUnits=true) => {
    const numberFormat = formatUnits ? parseFloat(ethers.formatUnits(number,18)).toFixed(2) :
    parseFloat(number.toString()).toFixed(2)

    return Number(numberFormat)
  }

  interface holder {
    tokenId: string,
    address: string
  }

  const AirlyftContract = async () => {


    airliftAddress = "0x293120876C4D69B6aa46510A14E58Dbd4e727845"

    ArliftContract = new ethers.Contract(airliftAddress, Erc721Artifacts.abi, wallet) as unknown as Erc721;

    // Obter todos os eventos Transfer
    const filter = ArliftContract.filters.Transfer();
    const events = await ArliftContract.queryFilter(filter,7807633);

    let holders: holder[] = [];

    for (let event of events) {
        const { to, tokenId } = event.args;
        holders.push({
          tokenId:tokenId.toString(), 
          address:to
        })
    }

    console.log({holders})

    return holders

  }

  before(async function () {

    console.log(`Execute in Network ${network.name}\n\n`)

  
  });


  it("Airlyft Contract", async function () {
    console.log("\n===================  \n\n")

    await AirlyftContract()

  });


  // it("TOKEN METADATA", async function () {
  //   console.log("\n===================  \n\n")

  //   let tx = await PassportContract.getTokenMetadata(0) as unknown as PassportMetadata
  //   console.log("TOKEN METADATA -->",tx)

  // });

  // it("OWNER METADATA", async function () {
  //   console.log("\n===================  \n\n")

  //   let tx = await PassportContract.getOwnerTokenMetadata(OWNER.address) as unknown as PassportMetadata
  //   console.log("OWNER METADATA -->",tx)

  // });
  // it("OTHER_HOLDER PASSAPORT ID", async function () {

  //   console.log("\n===================  \n\n")

  //   let tx = await PassportContract.getOwnerTokenId(OTHER_HOLDER.address)
  //   console.log("OTHER_HOLDER PASSAPORT ID -->",tx)

  // });
  
});

