//import database from "@/database/billing_control.database";
//import {ethers} from 'ethers'; // Load Ethers library
import { ethers, network } from 'hardhat';
import { RMRKCatalogImpl } from "typechain-types";
import {wallet} from '@/loaders/provider'
import { configureCatalog } from "../../scripts/equippable/utils/configureCatalog";
import env from "@/config";

class PassportService {

	//PassportContract : RMRKCatalogImpl = new ethers.Contract(env.CATALOG_CONTRACT_ADDRESS, , wallet) as unknown as RMRKCatalogImpl;

	async configureCatalog() {

		const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl') as unknown as RMRKCatalogImpl;
		const Catalog = <RMRKCatalogImpl>catalogFactory.attach(env.CATALOG_CONTRACT_ADDRESS);
	
		const actualCost = await configureCatalog(Catalog,env.ALIEN_CONTRACT_ADDRESS,'','')
		
		return actualCost
	
	}

}

export default new PassportService();
