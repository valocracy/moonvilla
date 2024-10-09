/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ethers,network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Passport, Alien,RMRKCatalogImpl } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { deployPassport} from '../../scripts/deploy-methods-test';
 

describe("EQUIPPABLE COMPOSABLE\n\n", function () {

  let PassportContract: Passport;
  let AlienContract:Alien;
  let Catalog: RMRKCatalogImpl;
  let OTHER_HOLDER: HardhatEthersSigner;
  let THIRD_HOLDER: HardhatEthersSigner;
  let OWNER:HardhatEthersSigner;
  let chunkiesAddress: string;
  let alienAddress: string;
  let catalogAddress: string;
  let passportAddress:string;

  type PassportMetadata = {
    username:string;
    discord:string;
    twitter:string;
    date:number
  };

  const metadata:PassportMetadata = {
    username:"RaeII",
    discord:"@Rael",
    twitter:"@Porrael",
    date:123
  }


  const twoFixed = (number:bigint,formatUnits=true) => {
    const numberFormat = formatUnits ? parseFloat(ethers.formatUnits(number,18)).toFixed(2) :
    parseFloat(number.toString()).toFixed(2)

    return Number(numberFormat)
  }

  before(async function () {
    //Carteira que faz deploy e assina as tranzações
    
    //Outra carteira de teste
    [OWNER,OTHER_HOLDER,THIRD_HOLDER] = await ethers.getSigners() as unknown as HardhatEthersSigner[];

    PassportContract  = await deployPassport(OWNER.address)  
   
    passportAddress = await PassportContract.getAddress()
  
  });


  it("Should mint NFT with valid signature", async function () {
    const ipfsHash = "QmXxxx..."; // Substitua por um hash IPFS válido
    const messageHash = ethers.solidityPackedKeccak256(
      ["string","uint64", "address"],
      [ipfsHash,1, OTHER_HOLDER.address]
    );
    const messageHashBinary = ethers.getBytes(messageHash);
    const signature = await OWNER.signMessage(messageHashBinary);
    console.log(OWNER.address)
    let PassportContractConnect = PassportContract.connect(OTHER_HOLDER);
    const ownerAddress = await  PassportContractConnect.owner()
    console.log({ownerAddress})
      
    await PassportContractConnect.mintWithEquippableAsset(
      ipfsHash,
      1,
      signature,
      metadata
    )

    // // address to,
    // // string memory tokenURI,
    // // uint64 equippableGroupId,
    // // address catalogAddress,
    // // uint64[] memory partIds,
    // // PassportMetadata memory passportMetadata,
    // // bytes memory signature

    // expect(await PassportContract.tokenURI(1)).to.equal(ipfsHash);
  });

  // it("Should fail to mint with invalid signature", async function () {
  //   const ipfsHash = "QmXxxx..."; // Substitua por um hash IPFS válido
  //   const messageHash = ethers.utils.solidityKeccak256(
  //     ["string", "address"],
  //     [ipfsHash, OWNER.address]
  //   );
  //   const messageHashBinary = ethers.utils.arrayify(messageHash);
  //   const signature = await OTHER_HOLDER.signMessage(messageHashBinary); // Assinatura inválida

  //   await expect(
  //     secureNFTMint.connect(OWNER).mint(ipfsHash, signature)
  //   ).to.be.revertedWith("Invalid signature");
  // });

  // it("Should fail to mint with used IPFS hash", async function () {
  //   const ipfsHash = "QmXxxx..."; // Substitua por um hash IPFS válido
  //   const messageHash = ethers.utils.solidityKeccak256(
  //     ["string", "address"],
  //     [ipfsHash, OWNER.address]
  //   );
  //   const messageHashBinary = ethers.utils.arrayify(messageHash);
  //   const signature = await owner.signMessage(messageHashBinary);

  //   await secureNFTMint.connect(OWNER).mint(ipfsHash, signature);

  //   await expect(
  //     secureNFTMint.connect(OWNER).mint(ipfsHash, signature)
  //   ).to.be.revertedWith("IPFS hash already used");
  // });
  
});

