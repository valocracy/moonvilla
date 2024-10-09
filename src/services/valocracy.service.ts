//import database from "@/database/billing_control.database";
import {ethers} from 'ethers'; // Load Ethers library
import { Valocracy,LpValocracy,USDT } from "typechain-types";
import valocracyArti from 'artifacts/contracts/Valocracy.sol/Valocracy.json';
import lpValocracy from 'artifacts/contracts/LpValocracy.sol/LpValocracy.json';
import {wallet,} from '@/loaders/provider'
import env from "@/config";

class ValocracyService {

	ValocracyContract : Valocracy = new ethers.Contract(env.VALOCRACY_CONTRACT_ADDRESS, valocracyArti.abi, wallet) as unknown as Valocracy;
	LpContract : LpValocracy = new ethers.Contract(env.LP_VALOCRACY_CONTRACT_ADDRESS, lpValocracy.abi, wallet) as unknown as LpValocracy;

	async config() {
	
		await this.approve()
	}

	async approve() {
	
		const amountToToken = ethers.parseUnits("9999999999999999999999999999999999999999999999", 18);
		console.log('\n\nAQUIIIII 1\n\n')
		let tx = await this.LpContract.approve(env.VALOCRACY_CONTRACT_ADDRESS,amountToToken)
		console.log('\n\nAQUIIIII 2\n\n')
		await tx.wait()

		console.log('\n\nAQUIIIII 3\n\n')

		const allowance = await this.LpContract.allowance(wallet.address,env.VALOCRACY_CONTRACT_ADDRESS)     
		console.log('ALLOWANCE',ethers.formatUnits(allowance,18)); 
	}

	async allowance() {
		const allowance = await this.LpContract.allowance(wallet.address,env.VALOCRACY_CONTRACT_ADDRESS)     
		console.log('ALLOWANCE',ethers.formatUnits(allowance,18)); 

		return ethers.formatUnits(allowance,18)
	}

	async balanceOfUsdt() {

		const usdt:USDT = new ethers.Contract(env.USDT_CONTRACT_ADDRESS_MOOBEAM, lpValocracy.abi, wallet) as unknown as USDT;
	
		const balance = await usdt.balanceOf(env.VALOCRACY_CONTRACT_ADDRESS)
		const balanceOf = ethers.formatUnits(balance,18) 
		console.log("QUANTIDADE DE USDT NO CONTRATO DA VALOCRACIA -> ",balanceOf,"\n\n");
		return balanceOf
	
	}

	async error() {
	
		try {
			const decodedError = this.ValocracyContract.interface.parseError("0xfb8f41b2000000000000000000000000fbd318ad29d9639bf88d84de8f54f66c91957cef00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac7230489e80000");
			console.log("Erro decodificado:", decodedError);
		} catch (decodeError) {
			console.log("Não foi possível decodificar o erro:", decodeError);
		}
		
		return 'DALE PASSPORT'
	}
}

export default new ValocracyService();
