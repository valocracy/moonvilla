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
    Catalog = await deployCatalog('s')
    catalogAddress = await Catalog.getAddress()

    PassportContract = await deployPassport(catalogAddress)
    passortAddress = await PassportContract.getAddress();
    
    AlienContract = await deployAlien(passortAddress)
    MintAlienContract  = await deployMintAlien()

    
    alienAddress = await AlienContract.getAddress();
    
    mintAlienAddress = await MintAlienContract.getAddress();

    // console.log("ADDRESS PASSPORT ->",passortAddress)
    // console.log("ADDRESS ALIEN ->",alienAddress)
    // console.log("ADDRESS CATALOG ->",catalogAddress)
    // console.log("ADDRESS MINTALIEN ->",mintAlienAddress)

    const fundAmount = ethers.parseEther("1"); 
    for (let i = 0; i < 1000; i++) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      wallets.push(wallet as unknown as HardhatEthersSigner);

      await OWNER.sendTransaction({
        to: wallet.address,
        value: fundAmount
      });
    }

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

  //   //TEST NUMERO ALEATÓRIO
  //   it("GERANDO IPFS", async function () {
  //     console.log("\n===================  \n\n")
  
  //     for(let i=0; i<10000; i++){
  //       const tx = await MintAlienContract.getRandomTokenURI()
  //       await tx.wait()
  //     }
     
  //   }).timeout(6000000);

  // //TEST NUMERO ALEATÓRIO
  // it("ADICIONANDO NO ARRAY", async function () {
  //   this.timeout(60000000);
  //   console.log("\n===================  \n\n")

  //   const ipfs = "ipfs://QmaDAtdy7h2JyGYe3AYUcfe3u6wDbJA6P6T6mBtfYiTmPL/json/aliens/alien"

  //   const arrayTokenUri = [];

  //   for(let i=0; i<10000; i++){
  //     let tokenURI = await MintAlienContract.getTokenURIByIndex(i)
  //     arrayTokenUri.push(tokenURI)
  //     console.log('RANDOM TOKEN URI -->>',i,tokenURI)
  //   }

  //   const index1 = arrayTokenUri.findIndex(e => e == `${ipfs}1.json`)
  //   const index5000 = arrayTokenUri.findIndex(e => e == `${ipfs}5000.json`)
  //   const index10000 = arrayTokenUri.findIndex(e => e == `${ipfs}10000.json`)

  //   console.log({index1})
  //   console.log({index5000})
  //   console.log({index10000})
  //   console.log('\nTAMANHO', arrayTokenUri.length)
   
  // }).timeout(6000000);


  //LEVEL MINT  
  it("level mint", async function () {
    console.log("\n===================  \n\n")

    const level = await MintAlienContract.getStatusLevel()
    console.log('LEVEL MINTs ->',level)
  });

  //LEVEL MINT  
  it("level mint", async function () {
    console.log("\n===================  \n\n")

    const level = await MintAlienContract.getStatusLevel()
    expect(level).to.deep.equal([false,false,false,false]);
  });

  //SETA ENDEREÇOS NA WAITLIST E TOKENSURIS NO CONTRATO   WHITELIST 1
  it("Add address in waitlist 1", async function () {
    console.log("\n===================  \n\n")

    async function addToWhitelist(wallets:HardhatEthersSigner[]) {
      // Defina o tamanho do bloco
      const batchSize = 100;
      
      // Calcule o número de blocos
      const numBatches = Math.ceil(wallets.length / batchSize);
      
      for (let i = 0; i < numBatches; i++) {
        // Pegue um bloco de 100 carteiras
        const batch = wallets.slice(i * batchSize, (i + 1) * batchSize);
        
        // Adicione o bloco à whitelist
        let tx = await MintAlienContract.addToWhitelist1(batch);
        await tx.wait();
        
        console.log(`Batch ${i + 1}/${numBatches} added to whitelist`);
      }
    }

    const waletsWhitelist1_200wallets = wallets.slice(0,200)
    console.log("TAMANHO ARRAY PARA ADICIONAR NA WL 1",waletsWhitelist1_200wallets.length);
    
    await addToWhitelist(waletsWhitelist1_200wallets)

    console.log('###### WHITELIST 1 COMPLETA ######')

  });

  //   ERROR
  // SETA ENDEREÇOS NA WAITLIST E TOKENSURIS NO CONTRATO  WHITELIST 1
  it("Add address in waitlist 1", async function () {
    console.log("\n===================  \n\n")

    let tx;
    try {

      tx = await MintAlienContract.addToWhitelist1(list1ERRO)
      await tx.wait()
      
    } catch (error: any) {

      expect(error.message).to.include('WhiteListLengthExceeded');
      console.log("LIMITE DE WHITELIST1 EXECEDIDO COMO EXPERADO")
      
    }

  });

  

  //SETA ENDEREÇOS NA WAITLIST E TOKENSURIS NO CONTRATO   WHITELIST 2
  it("Add address in whitelist _2_", async function () {
    console.log("\n===================  \n\n")

    async function addToWhitelist(wallets:HardhatEthersSigner[]) {
      // Defina o tamanho do bloco
      const batchSize = 100;
      
      // Calcule o número de blocos
      const numBatches = Math.ceil(wallets.length / batchSize);
      
      for (let i = 0; i < numBatches; i++) {
        // Pegue um bloco de 100 carteiras
        const batch = wallets.slice(i * batchSize, (i + 1) * batchSize);
        
        // Adicione o bloco à whitelist
        let tx = await MintAlienContract.addToWhitelist2(batch);
        await tx.wait();
        
        console.log(`Batch ${i + 1}/${numBatches} added to whitelist`);
      }
    }

    const waletsWhitelist2_300wallets = wallets.slice(200,500)
    console.log("TAMANHO ARRAY PARA ADICIONAR NA WL 2",waletsWhitelist2_300wallets.length);
    
    await addToWhitelist(waletsWhitelist2_300wallets)

    console.log('###### WHITELIST 2 COMPLETA ######')

  });


  //ERROR
  //SETA ENDEREÇOS NA WHITELIST TOKENSURIS NO CONTRATO  WHITELIST 2
  it("Add address in whitelist 2 ERROR", async function () {
    console.log("\n===================  \n\n")

    let tx;
    try {

      tx = await MintAlienContract.addToWhitelist2(list2ERRO)
      await tx.wait()
      
    } catch (error: any) {

      expect(error.message).to.include('WhiteListLengthExceeded');
      console.log("LIMITE DE WHITELIST 2 EXECEDIDO COMO EXPERADO")
      
    }

  });

   

  //ERROR
  //NIVEL FECHADOS
  it("Mint Alien", async function () {
    console.log("\n===================  \n\n")

    const MintAlienContractConnect = MintAlienContract.connect(OTHER_HOLDER);

    const mintCost = ethers.parseEther("2.5")
    try {

      let tx = await MintAlienContractConnect.mintAlienLevel1({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {

      expect(error.message).to.include('LevelNotActive');
      console.log("NIVEL 1 NÃO ESTÁ ABERTO")
      
    }

    try {

      let tx = await MintAlienContractConnect.mintAlienLevel2({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {
      expect(error.message).to.include('LevelNotActive');
      console.log("NIVEL 2 NÃO ESTÁ ABERTO")
      
    }


    try {

      let tx = await MintAlienContractConnect.mintAlienLevel3({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {
      expect(error.message).to.include('LevelNotActive');
      console.log("NIVEL 3 NÃO ESTÁ ABERTO")
      
    }

    try {

      let tx = await MintAlienContractConnect.mintAlienLevel4({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {
      expect(error.message).to.include('LevelNotActive');
      console.log("NIVEL 4 NÃO ESTÁ ABERTO")
      
    }

  });

  //OPEN LEVEL  
  it("set level", async function () {
    console.log("\n===================  \n\n")

    let level = await MintAlienContract.setLevelStatus(1,true)
    await level.wait()

    // level = await MintAlienContract.setLevelStatus(2,true)
    // await level.wait()

    // level = await MintAlienContract.setLevelStatus(3,true)
    // await level.wait()
  });

  //PAYMENT ERROR
  it("Mint Alien", async function () {
    console.log("\n===================  \n\n")

    const mintCost = ethers.parseEther("2.7")
    try {
      let MintAlienContractConnect =  MintAlienContract.connect(wallets[100]);
      let tx = await MintAlienContractConnect.mintAlienLevel1({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {

      expect(error.message).to.include('IncorrectPaymentAmount');
      console.log("VALOR DE PAGAMENTO ERRADO LISTA 1")
      
    }

    //------

    let MintAlienContractConnect =  MintAlienContract.connect(wallets[320]);
    let level = await MintAlienContract.setLevelStatus(2,true)
    await level.wait()
    level = await MintAlienContract.setLevelStatus(3,true)
    await level.wait()

    try {

      let tx = await MintAlienContractConnect.mintAlienLevel2({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {
      expect(error.message).to.include('IncorrectPaymentAmount');
      console.log("VALOR DE PAGAMENTO ERRADO LISTA 2")
      
    }

    //------

    MintAlienContractConnect =  MintAlienContract.connect(a12);
    try {

      let tx = await MintAlienContractConnect.mintAlienLevel3({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {
      expect(error.message).to.include('IncorrectPaymentAmount');
      console.log("VALOR DE PAGAMENTO ERRADO LISTA PUBLICA")
      
    }
    level = await MintAlienContract.setLevelStatus(2,false)
    await level.wait()
    level = await MintAlienContract.setLevelStatus(3,false)
    await level.wait()

  });
  
  it("Mint Alien", async function () {
    console.log("\n===================  \n\n")

    let MintAlienContractConnect = MintAlienContract.connect(wallets[320]);

    let mintCost = ethers.parseEther("0")
    try {

      let tx = await MintAlienContractConnect.mintAlienLevel1({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {

      expect(error.message).to.include('AddressNotWhitelisted');
      console.log("wallets[320] NÃO ESTÁ NA LISTA 1")
      
    }

    // ================== MINT VALENDO ==============

    let levelStatus = await MintAlienContract.getStatusLevel()
    console.log('LEVEL STATUS ANTES DO MINT 1',{levelStatus})

    for (let i = 0; i < 200; i++) {

      let MintAlienContractConnect = MintAlienContract.connect(wallets[i]);
      let tx = await MintAlienContractConnect.mintAlienLevel1({value:mintCost})
      await tx.wait()
      
    }

    levelStatus = await MintAlienContract.getStatusLevel()
    console.log('LEVEL STATUS DEPOIS DO MINT 1',{levelStatus})

    mintCost = ethers.parseEther("0.5")

    try {

      let MintAlienContractConnect = MintAlienContract.connect(wallets[100]);

      let tx = await MintAlienContractConnect.mintAlienLevel2({value:mintCost})
      await tx.wait()
      
    } catch (error:any) {
      expect(error.message).to.include('AddressNotWhitelisted');
      //console.log("wallets[100] NÃO ESTÁ NA LISTA 2")
      
    }

    for (let i = 200; i < 500; i++) {

      let MintAlienContractConnect = MintAlienContract.connect(wallets[i]);
      let tx = await MintAlienContractConnect.mintAlienLevel2({value:mintCost})
      await tx.wait()
      
    }

    levelStatus = await MintAlienContract.getStatusLevel()
    console.log('LEVEL STATUS DEPOIS DO MINT 2',{levelStatus})

    mintCost = ethers.parseEther("0.7")
    for (let i = 500; i < 650; i++) {

      let MintAlienContractConnect = MintAlienContract.connect(wallets[i]);
      let tx = await MintAlienContractConnect.mintAlienLevel3({value:mintCost})
      await tx.wait()
      
    }

    levelStatus = await MintAlienContract.getStatusLevel()
    console.log('LEVEL STATUS DEPOIS DO MINT 3',{levelStatus})

  });
  
  //mint erro
  // it("Mint Alien erro", async function () {
  //   console.log("\n===================  \n\n")

  //     // ================== MINT ERROR ==============

  //   let mintCost = ethers.parseEther("0")

  

  //   let levelStatus = await MintAlienContract.getStatusLevel()
  //   console.log('LEVEL STATUS ANTES DO MINT 1',{levelStatus})

  //   for (let i = 0; i < 198; i++) {

  //     let MintAlienContractConnect = MintAlienContract.connect(wallets[i]);
  //     let tx = await MintAlienContractConnect.mintAlienLevel1({value:mintCost})
  //     await tx.wait()
      
  //   }

  //   levelStatus = await MintAlienContract.getStatusLevel()
  //   console.log('LEVEL STATUS DEPOIS DO MINT 1',{levelStatus})

  //   mintCost = ethers.parseEther("0.5")

  //   let level = await MintAlienContract.setLevelStatus(2,true)
  //   await level.wait()

  //   for (let i = 200; i < 496; i++) {

  //     let MintAlienContractConnect = MintAlienContract.connect(wallets[i]);
  //     let tx = await MintAlienContractConnect.mintAlienLevel2({value:mintCost})
  //     await tx.wait()
      
  //   }

  //   levelStatus = await MintAlienContract.getStatusLevel()
  //   console.log('LEVEL STATUS DEPOIS DO MINT 2',{levelStatus})

  //   level = await MintAlienContract.setLevelStatus(3,true)
  //   await level.wait()

  //   mintCost = ethers.parseEther("0.7")
  //   for (let i = 500; i < 648; i++) {

  //     let MintAlienContractConnect = MintAlienContract.connect(wallets[i]);
  //     let tx = await MintAlienContractConnect.mintAlienLevel3({value:mintCost})
  //     await tx.wait()
      
  //   }

  //   levelStatus = await MintAlienContract.getStatusLevel()
  //   console.log('LEVEL STATUS DEPOIS DO MINT 3',{levelStatus})

  // });


  it("Supply Owner", async function () {
    console.log("\n===================  \n\n")

    let tx = await AlienContract.balanceOf(OWNER.address)
    
    console.log("SUPPLY OWNER -->",tx)
  });

  it("Supply OTHER_HOLDER", async function () {
    console.log("\n===================  \n\n")

    let tx = await AlienContract.balanceOf(OTHER_HOLDER.address)
    let balance = await ethers.provider.getBalance(OTHER_HOLDER.address)
    
    console.log("SUPPLY OTHER_HOLDER -->",tx)
    console.log("BALANCE OTHER_HOLDER -->",ethers.formatEther(balance))
  });

  it("Supply OWNER", async function () {
    console.log("\n===================  \n\n")

    let balance = await ethers.provider.getBalance(OWNER.address)
    
    console.log("BALANCE OWNER -->",ethers.formatEther(balance))
  });

  it("Balance contract", async function () {
    console.log("\n===================  \n\n")

    let balance = await ethers.provider.getBalance(mintAlienAddress)
    
    console.log("BALANCE MINT ALIEN CONTRACT -->",ethers.formatEther(balance))
  });

  it("Withdraw to owner", async function () {
    console.log("\n===================  \n\n")

    let tx = await MintAlienContract.withdraw()
    await tx.wait()
  });

  it("Supply OWNER", async function () {
    console.log("\n===================  \n\n")

    let balance = await ethers.provider.getBalance(OWNER.address)
    
    console.log("BALANCE OWNER -->",ethers.formatEther(balance))
  });

  //MINT LEVEL 4
  it("Mint 4", async function () {
    console.log("\n===================  \n\n")

      // ================== MINT ERROR ==============

    let costLevel4 = ethers.parseEther("0.3")

    let tx = await MintAlienContract.setCostLevel4(costLevel4)
    await tx.wait()

    let mintCost = ethers.parseEther("0.3")

    tx = await MintAlienContract.setCostLevel4(costLevel4)

    let levelStatus = await MintAlienContract.getStatusLevel()
    console.log('ANTES DE ABRIR MINT 4',{levelStatus})

    tx = await MintAlienContract.setLevelStatus(4,true)
    await tx.wait()

    for (let i = 650; i < 950; i++) {

      let MintAlienContractConnect = MintAlienContract.connect(wallets[i]);
      let tx = await MintAlienContractConnect.mintAlienLevel4({value:mintCost})
      await tx.wait()
      
    }

    levelStatus = await MintAlienContract.getStatusLevel()
    console.log('LEVEL STATUS DEPOIS DO MINT 4',{levelStatus})

    mintCost = ethers.parseEther("0.5")

  });

  it("hasAlreadyMinted OWNER", async function () {
    console.log("\n===================  \n\n")

    let AlreadyMinted = await MintAlienContract.hasAlreadyMinted(OWNER.address)

    AlienContract.tokenURI
    
    console.log("Já mintou essa porra -->",AlreadyMinted)
  });

  it("current mint", async function () {
    console.log("\n===================  \n\n")

    let currentMint = await MintAlienContract.getCurrentMint()

    console.log(currentMint)

    let levelStatus = await MintAlienContract.getStatusLevel()
    console.log('DEPOIS DO MINT 4',{levelStatus})
    
  });

  // it("TODOS OS TOKENS MINTADOS", async function () {
  //   console.log("\n===================  \n\n")

  //   let mintCost = ethers.parseEther("0.3")

  //   let MintAlienContractConnect = MintAlienContract.connect(OWNER);
  //   let tx = await MintAlienContractConnect.mintAlienLevel4({value:mintCost})
  //   await tx.wait()
    
  // });
  
  it("current mint", async function () {
    console.log("\n===================  \n\n")

    function allUnique(array:string[]) {
      // Crie um Set a partir do array
      let uniqueValues = new Set(array);
      
      // Compare o tamanho do Set com o tamanho do array original
      return uniqueValues.size === array.length;
    }

    const tokenUris = []
    for (let i = 0; i < 1000; i++) {
      let alreadyMinted = await MintAlienContract.hasAlreadyMinted(wallets[i].address)
      tokenUris.push(alreadyMinted.tokenURI)
    }
    console.log(allUnique(tokenUris)); // true
    
    tokenUris.push('ipfs://QmaDAtdy7h2JyGYe3AYUcfe3u6wDbJA6P6T6mBtfYiTmPL/json/aliens/alien302.json')
    console.log('DUPLICADO ->',allUnique(tokenUris)); // true
    
    
    //console.log(allUnique(arrayComDuplicatas)); 
    
  });

  it("owner mint alien", async function () {
    console.log("\n===================  \n\n")

    let tx = await MintAlienContract.mintAlienOwner(OTHER_HOLDER)
    await tx.wait()
    
    //console.log(allUnique(arrayComDuplicatas)); 
    
  });

  it("erro de usuário já mintou", async function () {
    console.log("\n===================  \n\n")

    let mintCost = ethers.parseEther("0.3")

    let MintAlienContractConnect = MintAlienContract.connect(wallets[90]);

    try {

      let tx = await MintAlienContractConnect.mintAlienLevel4({value:mintCost})
      await tx.wait()
      
    } catch (error) {
      console.log("USUÁRIO JÁ MINTOU")
      console.log(error)
    }

    //console.log(allUnique(arrayComDuplicatas)); 
    
  });

  it("mint ilimitado", async function () {
    console.log("\n===================  \n\n")

    let tx = await MintAlienContract.setUlimitedMint(true)
    await tx.wait()
 
    
  });

  it("agora sim", async function () {
    console.log("\n===================  \n\n")

    let mintCost = ethers.parseEther("0.3")

    let MintAlienContractConnect = MintAlienContract.connect(wallets[90]);


    let tx = await MintAlienContractConnect.mintAlienLevel4({value:mintCost})
    await tx.wait()
      
    //console.log(allUnique(arrayComDuplicatas)); 
    
  });

  it("hasMintedAlienNFT", async function () {
    console.log("\n===================  \n\n")

    let otherHolder = await MintAlienContract.hasMintedAlienNFT(wallets[949]);
    console.log('hasMintedAlienNFT',otherHolder)
    
  });
});

