/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";

const getEnvs = () => {
  
  let envPath = ''
  if(process.env.NODE_ENV === 'development'){
    envPath = '.dev'
  }else if(process.env.NODE_ENV === 'test'){
    envPath = '.test'
  }else{

    console.log('\n\n-- MAINNET --\n\n')

    envPath = '.prod'
  }
  const dotenvResult = dotenv.config({path: `.env${envPath}`});
  // const dotenvResult = dotenv.config({ path: `.env` });

  if(dotenvResult.error) {
    const processEnv = process.env;

    if(processEnv && !processEnv.error) return processEnv;
  }

  return dotenvResult;
}
// const envFound = dotenv.config({ path: `.env` });
const envFound:any = getEnvs();

if (envFound.error) {
  // This error should crash whole process

  throw new Error(`Couldn't find .env file. ${envFound.error}`);
}

interface ENV {
  PORT: number,
  PRIVATE_KEY:string,
  URL_RPC_NETWORK:string,
  PASSPORT_CONTRACT_ADDRESS:string,
  ALIEN_CONTRACT_ADDRESS:string,
  MINTALIEN_CONTRACT_ADDRESS:string,
  CATALOG_CONTRACT_ADDRESS:string,
  DEVELOPMENT:boolean,
  USDT_CONTRACT_ADDRESS_MOOBEAM:string
  VALOCRACY_CONTRACT_ADDRESS:string
  LP_VALOCRACY_CONTRACT_ADDRESS:string
}
const env: ENV = {
  // Application
  PORT: Number(process.env.PORT),
  PRIVATE_KEY:process.env.PRIVATE_KEY || '',
  URL_RPC_NETWORK:process.env.URL_RPC_NETWORK || '',
  PASSPORT_CONTRACT_ADDRESS:process.env.PASSPORT_CONTRACT_ADDRESS || '',
  ALIEN_CONTRACT_ADDRESS:process.env.ALIEN_CONTRACT_ADDRESS || '',
  MINTALIEN_CONTRACT_ADDRESS:process.env.MINTALIEN_CONTRACT_ADDRESS || '',
  CATALOG_CONTRACT_ADDRESS:process.env.CATALOG_CONTRACT_ADDRESS || '',
  USDT_CONTRACT_ADDRESS_MOOBEAM:process.env.USDT_CONTRACT_ADDRESS_MOOBEAM || '',
  VALOCRACY_CONTRACT_ADDRESS:process.env.VALOCRACY_CONTRACT_ADDRESS || '',
  LP_VALOCRACY_CONTRACT_ADDRESS:process.env.LP_VALOCRACY_CONTRACT_ADDRESS || '',
  DEVELOPMENT:process.env.NODE_ENV === 'development'
};

export default env;
