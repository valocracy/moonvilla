//import database from "@/database/billing_control.database";
import {ethers} from 'ethers'; // Load Ethers library
import { Passport } from "typechain-types";
import alien from 'artifacts/contracts/equippable/Alien.sol/Alien.json';
import {wallet} from '@/loaders/provider'
import env from "@/config";
import {ALIEN_EQUIPPABLE_GROUP} from "../../scripts/constants"
import gasService from './gas.service';


class AlienService {

	alienContract : Passport = new ethers.Contract(env.ALIEN_CONTRACT_ADDRESS, alien.abi, wallet) as unknown as Passport;

	async manageContributor() {
	
		let tx = await this.alienContract.manageContributor(env.MINTALIEN_CONTRACT_ADDRESS,true)
		const receipt = await tx.wait()

		const cost = gasService.transactionGasCost(receipt)
		
		return cost
	
	}

	async setValidParentForEquippableGroup() {
	
		let tx = await this.alienContract.setValidParentForEquippableGroup(ALIEN_EQUIPPABLE_GROUP,env.PASSPORT_CONTRACT_ADDRESS,ALIEN_EQUIPPABLE_GROUP)
		const receipt = await tx.wait()

		const cost = gasService.transactionGasCost(receipt)
		
		return cost
	
	}

	


}

export default new AlienService();
