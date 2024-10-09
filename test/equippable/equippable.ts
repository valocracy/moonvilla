/* eslint-disable @typescript-eslint/no-unused-vars */

import { ethers, } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Chunkies, ChunkyItems,RMRKCatalogImpl } from "../../typechain-types";
import { expect } from "chai";
import { deployChunkies, deployChunkyItems,deployCatalog } from '../../scripts/deploy-methods';
import {
  CHUNKY_CATALOG_METADATA,
  CHUNKY_CATALOG_TYPE
} from '../../scripts/constants';
import { configureCatalog } from "./utils/configureCatalog";
import { mintChunkies } from "./utils/mintPassport";
import { addItemAssets } from "./utils/addItemAssets";
import { mintItems } from "./utils/mintItems";
import * as C from '../../scripts/constants';
 

describe("EQUIPPABLE COMPOSABLE\n\n", function () {

  // By the order we minted assets, we can know that these are the ids. We could have custom methods to assets to names or to set the asset ids ourselves but since only the issuer can add assets, we can trust the order.
  // Pela ordem em que cunhamos os ativos, podemos saber que esses são os ids. Poderíamos ter métodos personalizados para nomes de ativos ou para definir nós mesmos os IDs dos ativos, mas como somente o emissor pode adicionar ativos, podemos confiar no pedido.
  const boneLeftAssetId = 1;
  const boneRightAssetId = 2;
  const flagLeftAssetId = 3;
  const flagRightAssetId = 4;
  const pencilLeftAssetId = 5;
  const pencilRightAssetId = 6;
  const spearLeftAssetId = 7;
  const spearRightAssetId = 8;

  let Chunkies: Chunkies;
  let ChunkyItems:ChunkyItems;
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
     * @Chunkies contrato LP token(ERC20)
     */
    [Chunkies,ChunkyItems,Catalog]  = await Promise.all([
      deployChunkies(),
      deployChunkyItems(),
      deployCatalog(CHUNKY_CATALOG_METADATA,CHUNKY_CATALOG_TYPE)
    ]) 

    chunkiesAddress = await Chunkies.getAddress();
    chunkyItemsAddress = await ChunkyItems.getAddress();
    catalogAddress = await Catalog.getAddress();


  });


  it("CONFIGURE CATALOG", async function () {

    console.log("\n===================  \n\n")

    await configureCatalog(Catalog,chunkyItemsAddress)

    //expect("DALE").to.deep.equal("DALE");
  });

  it("MINT CHUNKIES", async function () {

    console.log("\n===================  \n\n")

    await mintChunkies(Chunkies,catalogAddress,OWNER.address)

  });

  /**
   * ADICIONA NOVOS ITENS 
   */
  it("ADDING ITEM ASSETS", async function () {

    console.log("\n===================  \n\n")

    await addItemAssets(ChunkyItems,chunkiesAddress)

  });

  /**
   * ADICIONA NOVOS ITENS 
   */
  // it("MINT", async function () {
  //   console.log("\n===================  \n\n")

  //   let tx = await ChunkyItems.mint(OWNER.address, 1, `${C.BASE_IPFS_URI}/items/bone/left.json`);
  //   await tx.wait();
  //   const newTokenId = await ChunkyItems.totalSupply();
  //   tx = await ChunkyItems.addAssetToToken(newTokenId, boneLeftAssetId, 0);
  //   await tx.wait();
  //   tx = await ChunkyItems.addAssetToToken(newTokenId, boneRightAssetId, 0);
  //   await tx.wait();
  //   tx = await ChunkyItems.nestTransferFrom(
  //       await OWNER.getAddress(),
  //       chunkiesAddress,
  //       newTokenId,
  //       1, // Destination Chunky Id
  //       ethers.ZeroHash,
  //   );
  //   await tx.wait();

  // });

  /**
   * ADICIONA NOVOS ITENS 
   * USA função @nestMintWithAssets e substitui o exemplo comentado a cima 
   */
  it("MINT", async function () {
    console.log("\n===================  \n\n")
    
    await mintItems(ChunkyItems,chunkiesAddress)

  });


  
});

