/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ethers, } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Valocracy,LpValocracy, USDT } from "../typechain-types";
import { deployContract } from "../scripts/deploy/deployContract";
import { deployValocracy } from "../scripts/deploy/deployValocracy";
import { expect } from "chai";
import { getMintsDatas } from "./constants/mints";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ECONOMIC TOKEN DATA\n\n", function () {

  const twoFixedNumber = (number:number):number => {
    return Number(parseFloat(ethers.formatUnits(BigInt(number * 10 ** 18),18)).toFixed(2))
  }

  const twoFixed = (number:bigint):number => {
    
    return Number(parseFloat(ethers.formatUnits(number,18)).toFixed(2))

  }

  const bigToNumber = (number:bigint):number => {
    
    return parseFloat(ethers.formatUnits(number,18))

  }

  type Token = {
    governanceId: number;
    economicId: number;
  };

  type TokenMetadata = {
    id:string;
    name:string; 
    text:string;
  }

  type MintData = {
    to:string;
    tokenURI:string;
    rarity:number;
};

  type MintsData = {
    mintDatas:MintData[];
    rarityTotal:number
  };

  let valocracy: Valocracy;
  let lpContract: LpValocracy;
  let USDTContract: LpValocracy;
  let OWNER:HardhatEthersSigner;
  let OTHER_HOLDER: HardhatEthersSigner;
  let THIRD_HOLDER: HardhatEthersSigner;
  let valocracyAddress: string;
  let lpContractAddress: string;
  let USDTAddress: string;
  let mintsOwner:MintsData;
  let mintsOtherHolder:MintsData

  let lastMintId = 0;
  let totalSuplyNftPair = 0;
  let localTotalEconomicPower:number = 0
  let localBalanceEconomicTotal = 0
  let ownerBalanceUsdt = 0
  let otherHolderBalanceUsdt = 0
  const allNfts: number[][] = []
  const ownerNftIds: number[][] = []
  const otherHolderNftIds: number[][] = []

  const getLocalEconomicPower = () => {
    return localTotalEconomicPower
  }

  const getLocalRelativeEconomicPowerOfUser = (powerUserTotal:number) => {
    return  powerUserTotal * 100 / getLocalEconomicPower()
  }

  const getLocalEconomicShareOfUser = (powerUserTotal:number) => {
    const shareOfUser = localBalanceEconomicTotal * getLocalRelativeEconomicPowerOfUser(powerUserTotal) / 100
    return shareOfUser  
  }

  const claim = async (nftId:number,owner=true) => {

    const indexInAllNfts = allNfts.findIndex((e,i) => e[1] == nftId)

    let index:number;

    if(owner){

      index = ownerNftIds.findIndex(e => e[1] == nftId)

    }else{

      index = otherHolderNftIds.findIndex(e => e[1] == nftId)
      
    }
    
    if(index == -1) console.log('VOCE NÃO É O DONO DO NFT!')

    console.log({indexInAllNfts})

    allNfts[indexInAllNfts][1] = 0 
    ownerNftIds[index][1] = 0 
    totalSuplyNftPair --
    
    const PowerOfEffortToken = await valocracy.fetchEconomicPowerOfEffort(nftId); 
    localTotalEconomicPower -= bigToNumber(PowerOfEffortToken)

    const economicShareOfEffortToken = await valocracy.economicShareOfEffort(nftId);
    localBalanceEconomicTotal -= bigToNumber(economicShareOfEffortToken)

    if(owner){
      ownerBalanceUsdt += bigToNumber(economicShareOfEffortToken)
      mintsOwner.rarityTotal -= bigToNumber(PowerOfEffortToken)

      if(ownerNftIds[index][0] == 0){

        ownerNftIds[index] = ownerNftIds[ownerNftIds.length -1]
        ownerNftIds.pop()

        
        allNfts[indexInAllNfts] = allNfts[allNfts.length - 1]
        allNfts.pop()
      }

      
    }else{
      otherHolderBalanceUsdt += twoFixed(economicShareOfEffortToken)
      mintsOtherHolder.rarityTotal -= twoFixed(PowerOfEffortToken)

      if(otherHolderNftIds[index][0] == 0){

        otherHolderNftIds[index] = otherHolderNftIds[otherHolderNftIds.length -1]
        otherHolderNftIds.pop()

        
        allNfts[indexInAllNfts] = allNfts[allNfts.length - 1]
        allNfts.pop()
      }
      
    }

  }

  const transfer = async (nftId:number,ownerToOther=true) => {

    const indexInAllNfts = allNfts.findIndex((e,i) => e[1] == nftId)

    let index:number;

    if(ownerToOther){

      index = ownerNftIds.findIndex(e => e[1] == nftId)

    }else{

      index = otherHolderNftIds.findIndex(e => e[1] == nftId)
      
    }
    
    if(indexInAllNfts == -1) throw 'NFT NÃO ENCONTRADA'
    if(index == -1) throw 'VOCE NÃO É O DONO DO NFT!'

    if(ownerToOther){

      otherHolderNftIds.push([0,ownerNftIds[index][1]])
      allNfts.push([0,allNfts[indexInAllNfts][1]])

      ownerNftIds[index][1] = 0 
      allNfts[indexInAllNfts][1] = 0

      if(ownerNftIds[index][0] == 0){

        ownerNftIds[index] = ownerNftIds[ownerNftIds.length -1]
        ownerNftIds.pop()

        
        allNfts[indexInAllNfts] = allNfts[allNfts.length - 1]
        allNfts.pop()
      }

    }else{

      ownerNftIds.push([0,otherHolderNftIds[index][1]])
      allNfts.push([0,allNfts[indexInAllNfts][1]])

      otherHolderNftIds[index][1] = 0 
      allNfts[indexInAllNfts][1] = 0

      if(otherHolderNftIds[index][0] == 0){

        otherHolderNftIds[index] = otherHolderNftIds[otherHolderNftIds.length -1]
        otherHolderNftIds.pop()

        
        allNfts[indexInAllNfts] = allNfts[allNfts.length - 1]
        allNfts.pop()
      }

    }

    const PowerOfEffortToken = await valocracy.fetchEconomicPowerOfEffort(nftId); 

    if(ownerToOther){
     
      mintsOwner.rarityTotal -= bigToNumber(PowerOfEffortToken)
      mintsOtherHolder.rarityTotal += bigToNumber(PowerOfEffortToken)
    }else{
     
      mintsOtherHolder.rarityTotal -= bigToNumber(PowerOfEffortToken)
      mintsOwner.rarityTotal += bigToNumber(PowerOfEffortToken)
    }


  }

  before(async function () {

    //Carteira que faz deploy e assina as tranzações
    
    //Outra carteira de teste
    [OWNER,OTHER_HOLDER,THIRD_HOLDER] = await ethers.getSigners() as unknown as HardhatEthersSigner[];
   
    /**
     * @valocracy  contrato principal da Valocracia
     * @lpContract contrato LP token(ERC20)
     */
    [lpContract,USDTContract,]  = await Promise.all([
      deployContract(1000000000,"LpValocracy"),
      deployContract(1000,"USDT"),
    ]) as [LpValocracy,USDT];

    lpContractAddress = await lpContract.getAddress();
    USDTAddress = await USDTContract.getAddress();

    valocracy = await deployValocracy(lpContractAddress);
    valocracyAddress = await valocracy.getAddress();

    mintsOwner = getMintsDatas(OWNER.address,50)
    mintsOtherHolder = getMintsDatas(OTHER_HOLDER.address,50)

    localTotalEconomicPower = mintsOwner.rarityTotal + mintsOtherHolder.rarityTotal

  });

  /**
   * Transfere usdt para o contrato
   */
  it("Transfer 1000 usdt to contract", async function () {

    console.log("\n===================  \n\n")

    localBalanceEconomicTotal = 1000;
    const amountUSDT = ethers.parseUnits("1000", 18);
    await USDTContract.transfer(valocracyAddress,amountUSDT);
    const balanceUsdtValocracy = await USDTContract.balanceOf(valocracyAddress);

    expect( ethers.formatUnits(balanceUsdtValocracy,18)).to.deep.equal("1000.0");
  });

  /**
   * Aprova os Lps do OWNER para o contrato usar
   */
  it("Aprove LP to valocracy", async function () {
    console.log("\n =================== \n\n");

    const amountToToken = ethers.parseUnits("1000000000", 18);
    await lpContract.approve(valocracyAddress,amountToToken)
    const allowance = await lpContract.allowance(OWNER.address,valocracyAddress)     

    expect( ethers.formatUnits(allowance,18)).to.deep.equal("1000000000.0");
  });

  /**
   * Retorna os ids das nfts do OWNER
   */
  it("Get OWNER tokens ids", async function () {
    console.log("\n ===================  \n\n")

    const tokens = await valocracy.fetchOwnerTokens(OWNER.address,0,50,true);
    expect( tokens).to.deep.equal([]);

    console.log('NFTS IDs OWNER -->',tokens);

  });

  /**
  * Retorna os ids das nfts do OTHER
  */
  it("Get OTHER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.getRelativeEconomicPowerOfUser(THIRD_HOLDER.address)
    
    console.log('POWER THIRD_HOLDER',tokens)
  });

  it("total economic power", async function () {
    console.log("\n ===================  \n\n")

    const totalEconomicPower = await valocracy.fetchTotalEconomicPower();
    expect(totalEconomicPower).to.deep.equal(0);

    console.log('TOTAL ECONOMIC POWER -->',totalEconomicPower);
  });

  /**
   * Mints alternados entre duas carteiras
   */
  it("MINTS", async function () {
    console.log("\n ===================  \n\n")
    console.log("MINTS")

    let mintOwner = true;
    let index = 0

    const tokenMetadata:TokenMetadata = {
      id:"dale",
      name:"dd",
      text:'sss'
    } 

    for (let i = 0; i < 100; i++) {

      if(mintOwner){
    
        let tx = await valocracy.mintValocracy(
          mintsOwner.mintDatas[index].to,
          mintsOwner.mintDatas[index].tokenURI,
          mintsOtherHolder.mintDatas[index].tokenURI,
          mintsOwner.mintDatas[index].rarity,
          tokenMetadata
        );
        await tx.wait()

        ownerNftIds.push([lastMintId+1,lastMintId+2])
        allNfts.push([lastMintId+1,lastMintId+2])
        console
        mintOwner = false
        totalSuplyNftPair ++
      
      }else{
        
        let tx = await valocracy.mintValocracy(
          mintsOtherHolder.mintDatas[index].to,
          mintsOtherHolder.mintDatas[index].tokenURI,
          mintsOtherHolder.mintDatas[index].tokenURI,
          mintsOtherHolder.mintDatas[index].rarity,
          tokenMetadata
        );
        await tx.wait()

        otherHolderNftIds.push([lastMintId+1,lastMintId+2])
        allNfts.push([lastMintId+1,lastMintId+2])
        
        mintOwner = true
        totalSuplyNftPair ++
        index ++
      }
      
      lastMintId += 2
      
    }
  
  });
  
  /**
   *TOTAL DE TOKENS ECONOMICOS
   */
  it("Count tokens economics", async function () {

    
    const mintedSupply = await valocracy.fetchEconomicMintedSupply();
    expect(mintedSupply).to.deep.equal(totalSuplyNftPair);

    console.log('TOTAL TOKENS ECONOMICOS -->',mintedSupply);
  
    console.log("\n ===================  \n\n")
  });

  /**
  * Todos os tokens
  */
  it("all tokens economics", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchAllTokens(0,200,true);
    //console.log('ALL TOKENS ECONOMICS -->',tokens);

    expect(tokens).to.deep.equal(allNfts);
  });
  
  /**
   * Retorna os ids das nfts do OWNER
   */
  it("Get OWNER tokens ids", async function () {
    console.log("\n ===================  \n\n")

    const tokens = await valocracy.fetchOwnerTokens(OWNER.address,0,200,true);

    expect(tokens).to.deep.equal(ownerNftIds);
    
    //console.log('NFTS IDs do OWNER -->',tokens);

  });

  /**
   * Retorna os ids das nfts do OTHER_HOLDER
   */
  it("Get OTHER_HOLDER tokens ids", async function () {
    console.log("\n ===================  \n\n")

    const tokens = await valocracy.fetchOwnerTokens(OTHER_HOLDER.address,0,200,true);

    expect(tokens).to.deep.equal(otherHolderNftIds);

    //console.log('NFTS IDs do OTHER_HOLDER -->',tokens);

  });

  it("total economic power", async function () {
    console.log("\n ===================  \n\n")
    const totalEconomicPower = await valocracy.fetchTotalEconomicPower();
    expect(twoFixed(totalEconomicPower)).to.deep.equal(getLocalEconomicPower());

    console.log('TOTAL ECONOMIC POWER -->',twoFixed(totalEconomicPower));
  });

  /**
  * Poder economico OWNER
  */
  it("Get OWNER power", async function () {
    console.log("\n ===================  \n\n")

    console.log("\n\n -- OWNER -- \n\n");

     //PODER ECONOMIO TOTAL
    const power = await valocracy.fetchEconomicPowerOfUser(OWNER.address);
    //PORCENTAGEM QUE USUÁRIO TEM NA TESOURARIA
    const UserEconomicPowerOfEffort = await valocracy.getRelativeEconomicPowerOfUser(OWNER.address);
    //DINHEIRO TOTAL QUE O USUÁRIO TEM NA TESOURARIA
    const economicShareOfUser = await valocracy.economicShareOfUser(OWNER.address);

    console.log('PODER ECONOMICO TOTAL OWNER -->',twoFixed(power));
    console.log('PORCENTAGEM TOTAL DA TESOURARIA -->',twoFixed(UserEconomicPowerOfEffort));
    console.log('DINHEIRO TOTAL QUE O USUÁRIO TEM NA TESOURARIA -->',twoFixed(economicShareOfUser));

    expect(twoFixed(power)).to.deep.equal(mintsOwner.rarityTotal);   
    expect(twoFixed(UserEconomicPowerOfEffort)).to.deep.equal(twoFixedNumber(getLocalRelativeEconomicPowerOfUser(mintsOwner.rarityTotal)));
    expect(twoFixed(economicShareOfUser)).to.deep.equal(twoFixedNumber(getLocalEconomicShareOfUser(mintsOwner.rarityTotal)));

    //expect(tokens).to.deep.equal([[ 1n, 2n ], [ 3n, 4n ],[5n, 6n ]]);

  });

  /**
  * Poder economico OTHER HOLDER
  */
  it("Get OTHER HOLDER power", async function () {
    console.log("\n ===================  \n\n")
    console.log("\n\n -- OTHER HOLDER -- \n\n");

    //PODER ECONOMIO TOTAL
    const power = await valocracy.fetchEconomicPowerOfUser(OTHER_HOLDER.address);

    //PORCENTAGEM QUE USUÁRIO TEM NA TESOURARIA
    const UserEconomicPowerOfEffort = await valocracy.getRelativeEconomicPowerOfUser(OTHER_HOLDER.address);

    //DINHEIRO TOTAL QUE O USUÁRIO TEM NA TESOURARIA
    const economicShareOfUser = await valocracy.economicShareOfUser(OTHER_HOLDER.address);

    console.log('PODER ECONOMICO TOTAL OTHER_HOLDER -->',twoFixed(power));
    console.log('PORCENTAGEM TOTAL DA TESOURARIA  OTHER_HOLDER-->',twoFixedNumber(getLocalRelativeEconomicPowerOfUser(mintsOtherHolder.rarityTotal)));
    console.log('DINHEIRO TOTAL QUE O USUÁRIO TEM NA TESOURARIA  OTHER_HOLDER-->',twoFixedNumber(getLocalEconomicShareOfUser(mintsOtherHolder.rarityTotal)));

    expect(twoFixed(power)).to.deep.equal(mintsOtherHolder.rarityTotal);
    expect(twoFixed(UserEconomicPowerOfEffort)).to.deep.equal(twoFixedNumber(getLocalRelativeEconomicPowerOfUser(mintsOtherHolder.rarityTotal)));
    expect(twoFixed(economicShareOfUser)).to.deep.equal(twoFixedNumber(getLocalEconomicShareOfUser(mintsOtherHolder.rarityTotal)));

  });

  /**
  * TOKEN 2
  */
  // it("TOKEN 2 DATA", async function () {
  //   console.log("\n ===================  \n\n")
  //   console.log("\n\n -- TOKEN 2 DATA -- \n\n");

  //   //PORCENTAGEM ECONOMICA DO TOKEN
  //   const PowerOfEffortToken2 = await valocracy.fetchEconomicPowerOfEffort(2n); 
  //   expect(twoFixed(PowerOfEffortToken2)).to.deep.equal(10.00);  

  //   //PORCENTAGEM ECONOMICA DO TOKEN
  //   const relativePowerOfEffortToken2 = await valocracy.getRelativeEconomicPowerOfEffort(2n);
  //   expect(twoFixed(relativePowerOfEffortToken2)).to.deep.equal(33.33);

  //   //VALOR DO TOKEN EM RELAÇÃO AO TOTAL DA VALOCRACIA 
  //   const economicShareOfEffortToken2 = await valocracy.economicShareOfEffort(2n);
  //   expect(twoFixed(economicShareOfEffortToken2)).to.deep.equal(333.33);

  //   console.log('PODER ECONOMICO TOKEN 2-->',twoFixed(PowerOfEffortToken2));
  //   console.log('PORCENTAGEM ECONOMICA TOKEN 2 -->',twoFixed(relativePowerOfEffortToken2));
  //   console.log('VALOR ECONOMICO DO TOKEN 2 -->',twoFixed(economicShareOfEffortToken2));
  //   console.log("\n ===================  \n\n")
  // })

  /**
  * CLAIM OWNER
  */
  it("CLAIM", async function () {
    console.log("\n ===================  \n\n")

    const nftIdClaim = 2

    console.log('\n\n\n --- CLAIM OWNER TOKEN 2 --- \n\n\n ')
    const txResponse = await valocracy.claim(nftIdClaim);

    await claim(nftIdClaim)
  
  });

  it("Count tokens economics", async function () {
    const mintedSupply = await valocracy.fetchEconomicMintedSupply();
    expect(mintedSupply).to.deep.equal(totalSuplyNftPair);

    console.log('TOTAL TOKENS ECONOMICOS -->',mintedSupply);
  
    console.log("\n ===================  \n\n")
  });

  it("total economic power", async function () {
    const totalEconomicPower = await valocracy.fetchTotalEconomicPower();
    console.log('TOTAL ECONOMIC POWER -->',ethers.formatUnits(totalEconomicPower,18));

    expect(twoFixed(totalEconomicPower)).to.deep.equal(getLocalEconomicPower());

    console.log("\n ===================  \n\n")
  });

  /**
  * Todos os tokens economicos
  */
  it("all tokens economics", async function () {
    const tokens = await valocracy.fetchAllTokens(0,100,true);

    expect(tokens).to.deep.equal(allNfts);
   

    console.log("\n ===================  \n\n")
  });

  /**
   * Retorna os ids das nfts do OWNER
   */
  it("Get OWNER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OWNER.address,0,100,true);
    expect(tokens).to.deep.equal(ownerNftIds);
    console.log('TOKENS OWNER',tokens)
  });

  /**
   * Retorna os ids das nfts do OTHER
   */
  it("Get OTHER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OTHER_HOLDER.address,0,100,true);

    expect(tokens).to.deep.equal(otherHolderNftIds);
    console.log('TOKENS OTHER',tokens)
  });

  /**
  * Retorna saldo em usdt do owner
  */
  it("Get USDT balance owner", async function () {
    const balance = await USDTContract.balanceOf(OWNER.address);

    expect(twoFixed(balance)).to.deep.equal(twoFixedNumber(ownerBalanceUsdt));


    console.log('SALDO USDT OWNER -->',twoFixed(balance));

    console.log("\n ===================  \n\n")
  });


  /**
  * Retorna saldo em usdt do owner
  */
  it("Transfer", async function () {
    const tx = await valocracy.transferFrom(OWNER.address, OTHER_HOLDER.address,130)
    await tx.wait()
    await transfer(130)

    console.log("\n ===================  \n\n")
  });

  /**
   * Retorna os ids das nfts do OWNER
   */
  it("Get OWNER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OWNER.address,0,100,true);

    expect(tokens).to.deep.equal(ownerNftIds);
  });

  /**
   * Retorna os ids das nfts do OTHER
   */
  it("Get OTHER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OTHER_HOLDER.address,0,100,true);

    expect(tokens).to.deep.equal(otherHolderNftIds);
  });

  it("Transfer", async function () {
    const valocracyWithOtherHolder = valocracy.connect(OTHER_HOLDER);
    let tx = await valocracyWithOtherHolder.transferFrom(OTHER_HOLDER.address,OWNER.address,156)
    await tx.wait()
    tx = await valocracyWithOtherHolder.transferFrom(OTHER_HOLDER.address,OWNER.address,184)
    await tx.wait()
    tx = await valocracyWithOtherHolder.transferFrom(OTHER_HOLDER.address,OWNER.address,52)
    await tx.wait()
    await transfer(156,false)
    await transfer(184,false)
    await transfer(52,false)

    console.log("\n ===================  \n\n")
  });

  /**
   * Retorna os ids das nfts do OWNER
   */
  it("Get OWNER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OWNER.address,0,100,true);

    expect(tokens).to.deep.equal(ownerNftIds);
    console.log('TOKENS OWNER',tokens)
  });
  
  /**
    * Retorna os ids das nfts do OTHER
    */
  it("Get OTHER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OTHER_HOLDER.address,0,100,true);

    expect(tokens).to.deep.equal(otherHolderNftIds);
    console.log('TOKENS OTHER',tokens)
  });

  /**
  * CLAIM OWNER
  */
  it("CLAIM", async function () {
    console.log("\n ===================  \n\n")

    console.log('\n\n\n --- CLAIM OWNER TOKEN 2 --- \n\n\n ')
    let tx = await valocracy.claim(30);
    await tx.wait()
    tx = await valocracy.claim(184);
    await tx.wait()
    tx = await valocracy.claim(52);
    await tx.wait()

    await claim(30)
    await claim(184)
    await claim(52)
  
  });

  /**
   * Retorna os ids das nfts do OWNER
   */
  it("Get OWNER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OWNER.address,0,100,true);

    expect(tokens).to.deep.equal(ownerNftIds);
    console.log('TOKENS OWNER',tokens)
  });
  
  /**
    * Retorna os ids das nfts do OTHER
    */
  it("Get OTHER tokens ids", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchOwnerTokens(OTHER_HOLDER.address,0,100,true);

    expect(tokens).to.deep.equal(otherHolderNftIds);
    console.log('TOKENS OTHER',tokens)
  });

  /**
  * Poder economico OWNER
  */
  it("Get OWNER power", async function () {
    console.log("\n ===================  \n\n")

    console.log("\n\n -- OWNER -- \n\n");

     //PODER ECONOMIO TOTAL
    const power = await valocracy.fetchEconomicPowerOfUser(OWNER.address);
    //PORCENTAGEM QUE USUÁRIO TEM NA TESOURARIA
    const UserEconomicPowerOfEffort = await valocracy.getRelativeEconomicPowerOfUser(OWNER.address);
    //DINHEIRO TOTAL QUE O USUÁRIO TEM NA TESOURARIA
    const economicShareOfUser = await valocracy.economicShareOfUser(OWNER.address);

    console.log('PODER ECONOMICO TOTAL OWNER -->',twoFixed(power));
    console.log('PORCENTAGEM TOTAL DA TESOURARIA -->',twoFixed(UserEconomicPowerOfEffort));
    console.log('DINHEIRO TOTAL QUE O USUÁRIO TEM NA TESOURARIA -->',twoFixed(economicShareOfUser));

    expect(twoFixed(power)).to.deep.equal(mintsOwner.rarityTotal);   
    expect(twoFixed(UserEconomicPowerOfEffort)).to.deep.equal(twoFixedNumber(getLocalRelativeEconomicPowerOfUser(mintsOwner.rarityTotal)));
    expect(twoFixed(economicShareOfUser)).to.deep.equal(twoFixedNumber(getLocalEconomicShareOfUser(mintsOwner.rarityTotal)));

    //expect(tokens).to.deep.equal([[ 1n, 2n ], [ 3n, 4n ],[5n, 6n ]]);

  });

  /**
  * Todos os tokens
  */
  it("all tokens economics", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchAllTokens(0,200,true);
    //console.log('ALL TOKENS ECONOMICS -->',tokens);

    expect(tokens).to.deep.equal(allNfts);
  });

  /**
  * Todos os tokens
  */
  it("all tokens economics", async function () {
    console.log("\n ===================  \n\n")
    const tokens = await valocracy.fetchAllTokens(0,200,true);
    //console.log('ALL TOKENS ECONOMICS -->',tokens);

    expect(tokens).to.deep.equal(allNfts);
  });

  // it("all tokens economics", async function () {
  //   console.log("\n ===================  \n\n")
  //   const tx = await valocracy.burn(1,0);
  //   await tx.wait()
   
  // });

});


