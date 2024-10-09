//import database from "@/database/billing_control.database";
import {ethers} from 'ethers'; // Load Ethers library
import { Passport } from "typechain-types";
import passport from 'artifacts/contracts/equippable/Passport.sol/Passport.json';
import {wallet} from '@/loaders/provider'
import env from "@/config";
import gasService from './gas.service';

class PassportService {

	PassportContract : Passport = new ethers.Contract(env.PASSPORT_CONTRACT_ADDRESS, passport.abi, wallet) as unknown as Passport;

	async setAutoAcceptCollection() {

		const estimatedGas = await this.PassportContract.setAutoAcceptCollection.estimateGas(env.ALIEN_CONTRACT_ADDRESS, true);
		console.log('Estimated gas:', ethers.formatEther(estimatedGas), 'ETH');
	
		let tx = await this.PassportContract.setAutoAcceptCollection(env.ALIEN_CONTRACT_ADDRESS,true)

		const receipt = await tx.wait()

		const actualCost = await gasService.transactionGasCost(receipt)

		return actualCost
	}

	async error() {
	
		try {
			const decodedError = this.PassportContract.interface.parseError("0x0fbdf8dd");
			console.log("Erro decodificado:", decodedError);
		} catch (decodeError) {
			console.log("Não foi possível decodificar o erro:", decodeError);
		}
		
		return 'DALE PASSPORT'
	}


}

export default new PassportService();
