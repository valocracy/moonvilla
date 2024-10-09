import { ethers } from "ethers";
import { network } from "hardhat";
import env from "../config";

//const envFound = dotenv.config({path: `.env${process.env.NODE_ENV === 'development' ? '.dev' : ''}`});

const providerURL =  env.URL_RPC_NETWORK;
console.log({providerURL})
const provider = new ethers.JsonRpcProvider(providerURL)
const privateKey = env.PRIVATE_KEY ?? ''
const wallet = new ethers.Wallet(privateKey, provider);

export {
    provider,
    wallet
} 

