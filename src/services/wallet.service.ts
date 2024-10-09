//import database from "@/database/billing_control.database";
import {ethers} from 'ethers'; // Load Ethers library
import { MintAlien } from "typechain-types";
import mintAlien from 'artifacts/contracts/mintAlien/MintAlien.sol/MintAlien.json';
import {wallet,provider} from '@/loaders/provider'
import env from "@/config";

class walletService {

	MintAlienContract : MintAlien = new ethers.Contract(env.MINTALIEN_CONTRACT_ADDRESS, mintAlien.abi, wallet) as unknown as MintAlien;

	async balanceOf() {

		try {

			const balance = await provider.getBalance(wallet.address)
			

			return ethers.formatEther(balance)
			
		} catch (error:any) {
			// console.error("Erro detalhado:", error);
			if (error instanceof Error) {
				// console.error("Erro detalhado:", error.message);
		  
				// Se o erro for do tipo ethers.errors.TransactionError, podemos tentar decodificar
				if ('data' in error) {
					
					try {
						const decodedError = this.MintAlienContract.interface.parseError(String(error.data));
						console.log("Erro decodificado:", decodedError);
					} catch (decodeError) {
						console.log("Não foi possível decodificar o erro:", decodeError);
					}
				}
			} else {
				throw error
			}
		
		}
		
	}

}

export default new walletService();
