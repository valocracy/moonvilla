/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ethers, } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Passport, Alien,RMRKCatalogImpl,MintAlien } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { deployPassport, deployAlien,deployCatalog,deployMintAlien } from '../../scripts/deploy-methods-test';
import {
} from '../../scripts/constants';
import { configureCatalog } from "./utils/configureCatalog";
import * as C from '../../scripts/constants';
import { mintAlien } from "../../typechain-types/contracts";
import { wallet } from "@/loaders/provider";

interface EthersError extends Error {
  Error?: string;
  reason?: string;
  transaction?: unknown;
}
 

describe("MINT ALIEN\n\n", function () {

  let PassportContract: Passport;
  let AlienContract:Alien;
  let Catalog: RMRKCatalogImpl;
  let MintAlienContract: MintAlien;
  let OWNER:HardhatEthersSigner;
  let OTHER_HOLDER: HardhatEthersSigner;
  let THIRD_HOLDER: HardhatEthersSigner;
  let FOURTH_HOLDER: HardhatEthersSigner;
  let a5: HardhatEthersSigner;
  let a6: HardhatEthersSigner;
  let a7: HardhatEthersSigner;
  let a8: HardhatEthersSigner;
  let a9: HardhatEthersSigner;
  let a10: HardhatEthersSigner;
  let a11: HardhatEthersSigner;
  let a12: HardhatEthersSigner;
  let a13: HardhatEthersSigner;
  let a14: HardhatEthersSigner;
  let a15: HardhatEthersSigner;
  let a16: HardhatEthersSigner;
  let passortAddress: string;
  let alienAddress: string;
  let catalogAddress: string;
  let mintAlienAddress: string;

  let testAddresses :string[] = []
  let list1ERRO :string[] = []
  let list1 :string[] = []
  let list2ERRO :string[] = []
  let list2 :string[] = []

  const wallets: HardhatEthersSigner[] = [];
  

  const twoFixed = (number:bigint,formatUnits=true) => {
    const numberFormat = formatUnits ? parseFloat(ethers.formatUnits(number,18)).toFixed(2) :
    parseFloat(number.toString()).toFixed(2)

    return Number(numberFormat)
  }

  before(async function () {

    //Carteira que faz deploy e assina as tranzações
    
    //Outra carteira de teste
    [OWNER,OTHER_HOLDER,THIRD_HOLDER,FOURTH_HOLDER,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16] = await ethers.getSigners() as unknown as HardhatEthersSigner[];
   
    testAddresses = [
      OWNER.address,
      OTHER_HOLDER.address,
      THIRD_HOLDER.address,
      FOURTH_HOLDER.address,
      a5.address,
      a6.address,
      a7.address,
      a8.address,
      a9.address,
      a10.address,
      a11.address,
      a12.address,
      a13.address,
      a14.address,
      a15.address,
      a16.address,
    ];

    list1ERRO = [
      OWNER.address,
      OTHER_HOLDER.address,
      THIRD_HOLDER.address,
      a15.address
    ];

    list1 = [
      OWNER.address,
      OTHER_HOLDER.address,
      THIRD_HOLDER.address,
    ];

    list2ERRO = [
      FOURTH_HOLDER.address,
      a5.address,
      a6.address,
      a7.address,
      a8.address
    ];

    list2 = [
      FOURTH_HOLDER.address,
      a5.address,
      a6.address,
      a7.address,
    ];
    /**
     * @valocracy  contrato principal da Valocracia
     * @PassportContract contrato LP token(ERC20)
     */
    Catalog = await deployCatalog('s','d')
    catalogAddress = await Catalog.getAddress()

    PassportContract = await deployPassport(OWNER.address,catalogAddress)
    passortAddress = await PassportContract.getAddress();
    
    AlienContract = await deployAlien(passortAddress)
    MintAlienContract  = await deployMintAlien()

    
    alienAddress = await AlienContract.getAddress();
    
    mintAlienAddress = await MintAlienContract.getAddress();

  });

  /**
   * CONFIGURA CONTRATO 
   */
  it("CONFIGURE AND MINT", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.setAutoAcceptCollection(await AlienContract.getAddress(), true);
    await tx.wait();
    console.log('Passaport set to auto accept Alien');
  
    await configureCatalog(Catalog, await AlienContract.getAddress());
    console.log('Catalog configured');

    // await mintWithAssets(AlienContract, passortAddress , OWNER.address)
    // console.log('mintWithAssets');

  });

  //SETA ENDEREÇOS PARA O MINT  
  it("Add alien address in mint", async function () {
    console.log("\n===================  \n\n")

    await MintAlienContract.setContractsAddress(
      alienAddress,
      passortAddress,
      catalogAddress
    )

  });

  //DA PERMISSÃO PARA O MINTALIEN DE CONTRIBUIDOR  
  it("Add MintAlien contributor in Alien", async function () {
    console.log("\n===================  \n\n")

    await  AlienContract.manageContributor(mintAlienAddress,true)

  });

  it("MINT PASSPORT", async function () {
    console.log("\n===================  \n\n")

    let mintCost = ethers.parseEther("0.3")

    let PassportContractConnect = PassportContract.connect(OTHER_HOLDER);


    let tx = await PassportContractConnect.mintWithEquippableAsset()
    await tx.wait()
      
    //console.log(allUnique(arrayComDuplicatas)); 
    
  });
});

