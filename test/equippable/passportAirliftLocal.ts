/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ethers, } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Passport, Alien,RMRKCatalogImpl } from "../../typechain-types";
import { expect } from "chai";
import { deployPassport, deployAlien,deployCatalog } from '../../scripts/deploy-methods-test';
import {
  CHUNKY_CATALOG_METADATA,
  CHUNKY_CATALOG_TYPE
} from '../../scripts/constants';
import { configureCatalog } from "./utils/configureCatalog";
import { mintPassport } from "./utils/mintPassport";
import { addItemAssets } from "./utils/addItemAssets";
import { mintItems } from "./utils/mintItems";
import * as C from '../../scripts/constants';
 

describe("EQUIPPABLE COMPOSABLE\n\n", function () {

  type PassportMetadata = {
    name :string
    typ :string
    degenHoroscope :string
    birthDay :string
    birthMonth :string
    quality :string
    nacionality :string
  };
  
  const passportMetada:PassportMetadata = {
    name :"Dr.Ze",
    typ :"Type",
    degenHoroscope :"degenHoroscope",
    birthDay :"birthDay",
    birthMonth :"birthMonth",
    quality :"quality",
    nacionality :"nacionality"
  }

  const passportMetadaOther:PassportMetadata = {
    name :"Dr.Zefe",
    typ :"Type2",
    degenHoroscope :"degenHoroscope2",
    birthDay :"birthDay2",
    birthMonth :"birthMonth2",
    quality :"quality2",
    nacionality :"nacionality2"
  }

  let PassportContract: Passport;
  let AlienContract:Alien;
  let Catalog: RMRKCatalogImpl;
  let OTHER_HOLDER: SignerWithAddress;
  let THIRD_HOLDER: SignerWithAddress;
  let OWNER:SignerWithAddress;
  let chunkiesAddress: string;
  let chunkyItemsAddress: string;
  let catalogAddress: string;
  

  const twoFixed = (number:bigint,formatUnits=true) => {
    const numberFormat = formatUnits ? parseFloat(ethers.formatUnits(number,18)).toFixed(2) :
    parseFloat(number.toString()).toFixed(2)

    return Number(numberFormat)
  }

  before(async function () {

    //Carteira que faz deploy e assina as tranzações
    
    //Outra carteira de teste
    [OWNER,OTHER_HOLDER,THIRD_HOLDER] = await ethers.getSigners() as unknown as SignerWithAddress[];
   
    /**
     * @valocracy  contrato principal da Valocracia
     * @PassportContract contrato LP token(ERC20)
     */
    [PassportContract,AlienContract,Catalog]  = await Promise.all([
      deployPassport(OWNER.address),
      deployAlien(),
      deployCatalog(CHUNKY_CATALOG_METADATA,CHUNKY_CATALOG_TYPE)
    ]) 

    chunkiesAddress = await PassportContract.getAddress();
    chunkyItemsAddress = await AlienContract.getAddress();
    catalogAddress = await Catalog.getAddress();


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

    tx = await PassportContract.mintWithEquippableAsset(
      OWNER.address,
      `${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport01.json`, // TokenURI
      C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
      catalogAddress, // Catalog address
      `${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport01.json`, // URI de metadados, estamos usando o mesmo que tokenURI. Poderíamos usar um substituto para todos.
      [
        C.PASSPORT_V1_FIXED_PART_ID,
        C.ALIEN_SLOT_PART_ID
      ],
      passportMetada
    );
    await tx.wait();
  
    await addItemAssets(AlienContract, await PassportContract.getAddress());
    console.log('Item assets added');
  
    await mintItems(AlienContract, await PassportContract.getAddress());
    console.log('Items minted into passport');

  });

  it("OWNER PASSAPORT ID", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.getOwnerTokenId(OWNER.address)
    console.log("OWNER PASSAPORT ID -->",tx)

  });


  it("TOKEN METADATA", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.getTokenMetadata(0) as unknown as PassportMetadata
    console.log("TOKEN METADATA -->",tx)

  });

  it("OWNER METADATA", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.getOwnerTokenMetadata(OWNER.address) as unknown as PassportMetadata
    console.log("OWNER METADATA -->",tx)

  });

  it("MINT OTHER_HOLDER", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.mintWithEquippableAsset(
      OTHER_HOLDER.address,
      `${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport01.json`, // TokenURI
      C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
      catalogAddress, // Catalog address
      `${C.ALIEN_BASE_IPFS_URI}/json/catalog/passport/passport01.json`, // URI de metadados, estamos usando o mesmo que tokenURI. Poderíamos usar um substituto para todos.
      [
        C.PASSPORT_V1_FIXED_PART_ID,
        C.ALIEN_SLOT_PART_ID
      ],
      passportMetadaOther
    );
    await tx.wait();
  

  });

  it("OTHER_HOLDER METADATA", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.getOwnerTokenMetadata(OTHER_HOLDER.address) as unknown as PassportMetadata
    console.log("OTHER_HOLDER METADATA -->",tx)

  });

  it("TOKEN METADATA", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.getTokenMetadata(2) as unknown as PassportMetadata
    console.log("TOKEN METADATA -->",tx)

  });

  it("OTHER_HOLDER PASSAPORT ID", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.getOwnerTokenId(OTHER_HOLDER.address)
    console.log("OTHER_HOLDER PASSAPORT ID -->",tx)

  });

    it("OTHER_HOLDER PASSAPORT ID", async function () {
    console.log("\n===================  \n\n")

    let tx = await PassportContract.checkAlienEquippedPassport(catalogAddress,C.ALIEN_SLOT_PART_ID)
    console.log("CHECK ALIEN SENDER -->",tx)

    const checkAlien1 = await PassportContract.checkAlienEquippedPassport1(catalogAddress,C.ALIEN_SLOT_PART_ID)
    console.log("CHECK ALIEN SENDER RETURN UINT -->",checkAlien1)

    tx = await PassportContract.checkAlienEquippedPassportOwnerAddress(OWNER.address,catalogAddress,C.ALIEN_SLOT_PART_ID)
    console.log("CHECK ALIEN SENDER OWNER ADDRESS -->",tx)

  });
  
});

