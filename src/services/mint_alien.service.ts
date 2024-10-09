//import database from "@/database/billing_control.database";
import {ethers,ContractTransactionReceipt} from 'ethers'; // Load Ethers library
import { MintAlien } from "typechain-types";
import mintAlien from 'artifacts/contracts/mintAlien/MintAlien.sol/MintAlien.json';
import {wallet,provider} from '@/loaders/provider'
import { whitelist,mintStatus,configMintAlien } from "@/interfaces/whitelist";
import { readCsvFile,CsvRow } from "@/interfaces/whitelist";
import env from "@/config";
import fileService from './file.service';
import {delay} from "../../scripts/utils"
import gasService from './gas.service';

class mintAlienService {

	MintAlienContract : MintAlien = new ethers.Contract(env.MINTALIEN_CONTRACT_ADDRESS, mintAlien.abi, wallet) as unknown as MintAlien;

	async mint() {

		try {

			let tx = await this.MintAlienContract.mintAlienLevel1({value:0})
			await tx.wait()
			
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
				console.error("Ocorreu um erro desconhecido:", error);
			}
		
		}
		
		return 
	
	}

	async setWhitelistAddress(data: whitelist) {

		try {

			if(data.whitelist == 1){
				let tx = await this.MintAlienContract.addToWhitelist1(data.address)
				await tx.wait()
			}else if(data.whitelist == 2){
				let tx = await this.MintAlienContract.addToWhitelist2(data.address)
				await tx.wait()
			}
			
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
				console.error("Ocorreu um erro desconhecido:", error);
			}
		
		}
		
		return 
	
	}

	async setStatusMintLevel(data: mintStatus) {

		let tx;
		let receipt:ContractTransactionReceipt | null = null
		if(data.whitelist == 1){
			tx = await this.MintAlienContract.setLevelStatus(1,data.status)
			 receipt = await tx.wait();
		}else if(data.whitelist == 2){
			tx = await this.MintAlienContract.setLevelStatus(2,data.status)
			 receipt = await tx.wait();
		}else if(data.whitelist == 3){
			tx = await this.MintAlienContract.setLevelStatus(3,data.status)
			 receipt = await tx.wait();
		}else if(data.whitelist == 4){
			tx = await this.MintAlienContract.setLevelStatus(4,data.status)
			 receipt = await tx.wait();
		}

		if(receipt){
			const actualCost = await gasService.transactionGasCost(receipt)
			console.log('TOTAL COST SET LEVEL',actualCost)
		}
		
		return
	
	}

	async getStatusMinLevel() {
		
		const response = await this.MintAlienContract.getStatusLevel()
			
		return {
			level1:response.Level1,
			level2:response.Level2,
			level3:response.Level3,
			level4:response.Level4,
		}

	}

	async getCurrentMint() {
		
		const response = await this.MintAlienContract.getCurrentMint()
			
		return {
			currentMintWhitelist1:response.currentMintWhitelist1.toString(),
			currentMintWhitelist2:response.currentMintWhitelist2.toString(),
			currentMintPub:response.currentMintPub.toString(),
			currentTotalMint:response.currentTotalMint.toString(),
		}

	}

	async whitelistCount() {
		
		const response = await this.MintAlienContract.whitelistCount()

		console.log({response})
			
		return {
			whitelistCount1:response[0].toString(),
			whitelistCount2:response[1].toString()
		}

	}

	async mintAlienWhitelist() {
		const adiPrivateAddress = '2cff372bd76edb2999a10ce9492c7a95bcdd72cfb32105115b17a714a4cbbff2'
		const walletAdi = new ethers.Wallet(adiPrivateAddress, provider);

		const mintAlient : MintAlien = new ethers.Contract(env.MINTALIEN_CONTRACT_ADDRESS, mintAlien.abi, walletAdi) as unknown as MintAlien;
		
		console.log(ethers.parseEther("0"))

		try {

			const tx = await mintAlient.mintAlienLevel1({value:0})
			await tx.wait()
		} catch (error:any) {
			// console.error("Erro detalhado:", error);
			if (error instanceof Error) {
				// console.error("Erro detalhado:", error.message);
		  
				// Se o erro for do tipo ethers.errors.TransactionError, podemos tentar decodificar
				if ('data' in error) {
					console.log(error)
					try {
						const decodedError = this.MintAlienContract.interface.parseError(String(error.data));
						console.log("Erro decodificado:", decodedError);
					} catch (decodeError) {
						console.log("Não foi possível decodificar o erro:", decodeError);
					}
				}
			} else {
				console.error("Ocorreu um erro desconhecido:", error);
			}
		
		}

		return "DALE MINT"
	}

	async setConfigMintAlien(data: configMintAlien) {

		let tx = await this.MintAlienContract.setContractsAddress(
			data.alien_address,
			data.passport_address,
			data.catalog_address,
		)
		const receipt = await tx.wait()

		const actualCost = await gasService.transactionGasCost(receipt)
		
		return actualCost

	}

	private async addToWhitelist(wallets: string[], waitlist = 1) {
		const batchSize = 150;
		const numBatches = Math.ceil(wallets.length / batchSize);
		let totalCost = 0
		for (let i = 0; i < numBatches; i++) {
			const batch = wallets.slice(i * batchSize, (i + 1) * batchSize);
	
			try {
				let tx;
				if (waitlist === 1) {
					console.log('WHITELIST 1');
					tx = await this.MintAlienContract.addToWhitelist1(batch);
				} else {
					console.log('WHITELIST 2');
					tx = await this.MintAlienContract.addToWhitelist2(batch);
				}
	
				const receipt = await tx.wait();
				await delay(60000)
				const actualCost = await gasService.transactionGasCost(receipt)
				totalCost += actualCost
				
				console.log(`Batch ${i + 1}/${numBatches} added to whitelist`);
				console.log(`cost batch ${i + 1}`,actualCost)
			} catch (error: any) {
				if (error instanceof Error) {
					if ('data' in error) {
						try {
							const decodedError = this.MintAlienContract.interface.parseError(String(error.data));
							console.log("Erro decodificado:", decodedError);
						} catch (decodeError) {
							console.log("Não foi possível decodificar o erro:", decodeError);
						}
					} else {
						console.error("Erro:", error.message);
					}
				} else {
					console.error("Ocorreu um erro desconhecido:", error);
				}

				return
			}
		}

		console.log(`cost batch ${totalCost}`)
	}

	findDuplicateEmails(readCsvFiles: readCsvFile[]): void {
		const emailCounts: { [key: string]: { count: number; fileNames: string[]; lastRow: CsvRow } } = {};
		let emailsRemoveCount = 0;
	  
		for (const { fileName, csvRow } of readCsvFiles) {
		  for (const row of csvRow) {
			const { email } = row;
	  
			if (!email) continue;
	  
			if (emailCounts[email]) {
			  emailCounts[email].count++;
			  emailCounts[email].fileNames.push(fileName);
			  emailCounts[email].lastRow = row; // Atualiza para a última ocorrência
			} else {
			  emailCounts[email] = { count: 1, fileNames: [fileName], lastRow: row };
			}
		  }
		}
	  
		const consolidatedReadCsvFiles: readCsvFile[] = readCsvFiles.map(file => ({
		  fileName: file.fileName,
		  csvRow: file.csvRow.filter(row => {
			if (!row.email) return true;
			return emailCounts[row.email].lastRow === row;
		  })
		}));
	  
		for (const email in emailCounts) {
		  if (emailCounts[email].count > 1) {
			emailsRemoveCount += emailCounts[email].count - 1; // Conta quantos foram removidos
			//console.log(`Duplicate email '${email}' found in files: ${emailCounts[email].fileNames.join(', ')}`);
		  }
		}
	  
		console.log('\n\nQUANTIDADE DE EMAIL REMOVIDOS ->', emailsRemoveCount);
	  
		// Você pode retornar o consolidatedReadCsvFiles se quiser usar os dados filtrados
		// return consolidatedReadCsvFiles;
	  }

	consolidateUniqueEmails(readCsvFiles: readCsvFile[]): readCsvFile[] {
		const emailMap: Map<string, CsvRow> = new Map();
		const consolidatedReadCsvFiles: readCsvFile[] = [];
	  
		for (const { fileName, csvRow } of readCsvFiles) {
		  for (const row of csvRow) {
			if (!row?.email) {
			  // Se não houver e-mail, mantenha a linha como está
			  emailMap.set(Math.random().toString(), row);
			} else {
			  // Sobrescreve a entrada existente, mantendo assim a última ocorrência
			  emailMap.set(row.email, row);
			}
		  }
	  
		  const uniqueCsvRow: CsvRow[] = Array.from(emailMap.values());
	  
		  consolidatedReadCsvFiles.push({
			fileName,
			csvRow: uniqueCsvRow,
		  });
	  
		  // Limpa o mapa para o próximo arquivo
		  emailMap.clear();
		}
	  
		return consolidatedReadCsvFiles;
	}

	findDuplicateWallet(readCsvFiles: readCsvFile[]): void {
		const waletCounts: { [key: string]: { count: number; fileNames: string[] } } = {};
		let emailsRemoveCount = 0

		for (const { fileName, csvRow } of readCsvFiles) {
		  for (const { wallet } of csvRow) {

			if(!wallet) continue

			if (waletCounts[wallet]) {
			  waletCounts[wallet].count++;
			  waletCounts[wallet].fileNames.push(fileName);
			} else {
			  waletCounts[wallet] = { count: 1, fileNames: [fileName] };
			}
		  }
		}
	  
		for (const wallet in waletCounts) {
		  if (waletCounts[wallet].count > 1) {
			emailsRemoveCount ++
			//console.log(`Duplicate wallet '${wallet}' found in files: ${waletCounts[wallet].fileNames.join(', ')}`);
		  }
		}
		
		console.log('\n\nQUANTIDADE DE ENDEREÇOS REMOVIDOS ->',emailsRemoveCount)
	}

	consolidateUniqueWallet(readCsvFiles: readCsvFile[]): readCsvFile[] {
		const emailsSeen: Set<string> = new Set();
		const consolidatedReadCsvFiles: readCsvFile[] = [];
	  
		for (const { fileName, csvRow } of readCsvFiles) {
			const uniqueCsvRow: CsvRow[] = [];
			
			let line = 1
			for (const row of csvRow) {
				line ++
				row.wallet = row.wallet.replace(/\s/g, '').replace('\n','')

				try {

					const checkAddress = ethers.getAddress(row.wallet);
					// console.log('CHECK ADDRESS ->',checkAddress)
					
				} catch (error) {

					if(row.wallet != '0x3c02226B2A346926882B50a39d52361b9730500c'){
						console.log(`FILE: ${fileName} | LINE ${line} | INVALID ADDRESS: ${row.wallet} `)
						continue
					}
				
				}

				if (!emailsSeen.has(row.wallet)) {
					emailsSeen.add(row.wallet);
					uniqueCsvRow.push(row);
				}
			}
		
			consolidatedReadCsvFiles.push({
				fileName,
				csvRow: uniqueCsvRow,
			});
		}
	  
		return consolidatedReadCsvFiles;
	}
	
	consolidateWhitelists(whitelist1: string[], whitelist2: string[]) {
		const uniqueWallets = new Set<string>([...whitelist1, ...whitelist2]);
		const updatedWhitelist1: string[] = [];
		const updatedWhitelist2: string[] = [];
	  
		for (const wallet of uniqueWallets) {
		  const count1 = whitelist1.filter(w => w === wallet).length;
		  const count2 = whitelist2.filter(w => w === wallet).length;
	  
		  if (count1 > 0) {
			updatedWhitelist1.push(wallet);
		  }
	  
		  if (count2 > 0 && count1 === 0) {
			updatedWhitelist2.push(wallet);
		  }
		}
	  
		return {updatedWhitelist1, updatedWhitelist2};
	}

	async setWhistelistByCSVFile(){

		const communityWhitelist1 = ['KOLs','STAFF MV','GUILDA']
		const communityWhitelist2 = ['COMUNIDADES']

		const whitelist1: string[] =[]
		const whitelist2: string[] =[]

		const KOLs = ['email', 'username', 'wallet', 'community']
		const GUILDA = ['timestamp', 'email', 'username', 'wallet']
		const STAFFMV = ['username', 'wallet']
		const COMUNIDADES = ['timestamp', 'email', 'username', 'wallet', 'community']

		const dataFiles = await fileService.readCsvFile([
			{fileName:'STAFF MV',headers:STAFFMV},
			{fileName:'KOLs',headers:KOLs},
			{fileName:'GUILDA',headers:GUILDA},
			{fileName:'COMUNIDADES',headers:COMUNIDADES}
		])

		const checkTotalWl = {wl1:0,wl2:0}
		let totalWallets = 0;

		console.log('WHITELIST 1',checkTotalWl.wl1 )
		console.log('WHITELIST 2',checkTotalWl.wl2 )
		console.log('TOTAL WALLETS',totalWallets)

		console.log('\n\n')

		this.findDuplicateWallet(dataFiles)
		const dataFilesZeroWalletDuplicated = this.consolidateUniqueWallet(dataFiles)
		this.findDuplicateWallet(dataFilesZeroWalletDuplicated)

		console.log('\n\n')

		this.findDuplicateEmails(dataFilesZeroWalletDuplicated)
		const dataFilesZeroDuplicated = this.consolidateUniqueEmails(dataFilesZeroWalletDuplicated)
		this.findDuplicateEmails(dataFilesZeroDuplicated)

		dataFilesZeroDuplicated.map(dataFile => {

			console.log('LIST:',dataFile.fileName, 'WALLETS:', dataFile.csvRow.length)
			totalWallets += dataFile.csvRow.length

			if(communityWhitelist1.includes(dataFile.fileName)){
				
				dataFile.csvRow.map(e =>{
					whitelist1.push(e.wallet)	
				})

				checkTotalWl.wl1 += dataFile.csvRow.length
				
			}else if(communityWhitelist2.includes(dataFile.fileName)){
				dataFile.csvRow.map(e =>{
					whitelist2.push(e.wallet)	
				})

				checkTotalWl.wl2 += dataFile.csvRow.length

			}			

		})

		

		console.log('\n\nWHITELIST 1',checkTotalWl.wl1 )
		console.log('WHITELIST 2',checkTotalWl.wl2 )
		console.log('TOTAL WALLETS',totalWallets)

		

		await this.addToWhitelist(whitelist1)
		await this.addToWhitelist(whitelist2,2)

		return 'DALE'
	}
}

export default new mintAlienService();
