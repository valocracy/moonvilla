/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ethers} from 'ethers'; // Load Ethers library
import { Valocracy,LpValocracy, USDT } from "./typechain-types";
import valocracyJson from './artifacts/contracts/Valocracy.sol/Valocracy.json';
import lpJson from './artifacts/contracts/LpValocracy.sol/LpValocracy.json';
import USDTJson from './artifacts/contracts/USDT.sol/USDT.json';
import 'dotenv/config';
import { TypedContractEvent, TypedEventLog } from './typechain-types/common';
import env from './src/config'

type TokenMetadata = {
    id:string;
    name:string; 
    text:string;
}

const providerURL = 'https://rpc.api.moonbase.moonbeam.network';
const provider = new ethers.JsonRpcProvider(providerURL)
const privateKey = env.PRIVATE_KEY
const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);
const blockContractDeploy = 7327706
const contractAddress = '0x2dE8c14efFe82bfc3482f539b03356C84aB9f200'
const LpValocracyAddress= '0x40Bb55ffF56fE5da4607382e997D02A1Fd31a4e8'
const USDTAddress = '0xa1c0330A377ec8C794ee54ea8E228E3C95BAdc88'


const ValocracyContract : Valocracy = new ethers.Contract(contractAddress, valocracyJson.abi, wallet) as unknown as Valocracy;
const lpContract : LpValocracy = new ethers.Contract(LpValocracyAddress, lpJson.abi, wallet) as unknown as LpValocracy;
const USDTContract : USDT = new ethers.Contract(USDTAddress, USDTJson.abi, wallet) as unknown as USDT;

const main = async () => {

    type TokenMetadata = {
        id:string;
        name:string; 
        text:string;
      }


    const tokenMetadata:TokenMetadata = {
        id:"dale",
        name:"dd",
        text:'sss'
      } 

    // const owner = await USDTContract.owner()
    // console.log('OWNER',owner)

    // const amountUSDTMint = "99999999"
    // // await USDTContract.transfer("0xc823232C9B6BE317d2e4ac7c3E5496232224AACD",amountUSDTMint)
    // const txx = await USDTContract.mint("0xa650fC87c939CfBfF0B107E70F1dE3B27f5271dd",amountUSDTMint)
    // await txx.wait()
    // // //console.log('BALANCE',ethers.formatUnits(balance,18)); 
    // return
    // const balance = await USDTContract.balanceOf("0x466aFf4E362Ba868b82F1266b9b0AB7Bf97c3aaf");
    // console.log('BALANCE',ethers.formatUnits(balance,18)); 

    // return

    // lpContract.mint('0x466aFf4E362Ba868b82F1266b9b0AB7Bf97c3aaf','99999999')
    // return

    // const mintData: TokenMetadata = {
    //     id:"1",
    //     name:"d",
    //     text:"d"
    // }

    // const txx = await ValocracyContract.mintValocracy(wallet.address,"","",10,mintData);
    // await txx.wait()

    // const owner = await ValocracyContract.owner()
    // console.log({owner})

    // return

    let balanceLPValocracy = await lpContract.balanceOf(wallet.address);
    console.log("QUANTIDADE DE LP OWNER TEM -> ",ethers.formatUnits(balanceLPValocracy,18),"\n\n");
 
    let balanceUsdtValocracy = await USDTContract.balanceOf(wallet.address);
    console.log("QUANTIDADE DE USDT OWNER TEM -> ",ethers.formatUnits(balanceUsdtValocracy,18),"\n\n");

    const amountToToken = ethers.parseUnits("1000000000", 18);
    await lpContract.approve(contractAddress,amountToToken)

    const allowance = await lpContract.allowance(wallet.address,contractAddress)     
    console.log('ALLOWANCE',ethers.formatUnits(allowance,18)); 

    const amountUSDT = ethers.parseUnits("20000", 18);
    const tx = await USDTContract.transfer(contractAddress,amountUSDT);
    await tx.wait()
    
    const balanceUsdt = await USDTContract.balanceOf(contractAddress);
    console.log("QUANTIDADE DE USDT NO CONTRATO DA VALOCRACIA -> ",ethers.formatUnits(balanceUsdt,18),"\n\n");

    // const txxx = await ValocracyContract.fetchEconomicPowerOfUser('0x466aFf4E362Ba868b82F1266b9b0AB7Bf97c3aaf')
    // console.log(txxx)

    // balanceUsdtValocracy = await ValocracyContract.totalBalance();
    // console.log("QUANTIDADE DE USDT NO CONTRATO DA VALOCRACIA -> ",ethers.formatUnits(balanceUsdtValocracy,18),"\n\n");

    
    // const tokens = await ValocracyContract.getAllTokens()
    // console.log('ALL TOKENS ->', tokens)

    // const filter =  ValocracyContract.filters.Mint("0xed7b0e1944c75100dbdfc1ec69af03ccd16a8da6")
    // const events = await ValocracyContract.queryFilter(filter, 0, 'latest');
    // console.log({events})

    try {

        let tx = await ValocracyContract.mintValocracy(
            wallet.address,
            "dale",
            "dale",
            10,
            tokenMetadata
        )
        await tx.wait()
        
    } catch (error:any) {
        // console.error("Erro detalhado:", error);
        if (error instanceof Error) {
            // console.error("Erro detalhado:", error.message);
      
            // Se o erro for do tipo ethers.errors.TransactionError, podemos tentar decodificar
            if ('data' in error) {
                
                try {
                    const decodedError = ValocracyContract.interface.parseError(String(error.data));
                    console.log("Erro decodificado:", decodedError);
                } catch (decodeError) {
                    console.log("Não foi possível decodificar o erro:", decodeError);
                }
            }
        } else {
            console.error("Ocorreu um erro desconhecido:", error);
        }
    
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});