//import database from "@/database/billing_control.database";
import {ethers} from 'ethers'; // Load Ethers library
import { MintAlien } from "typechain-types";
import mintAlien from 'artifacts/contracts/mintAlien/MintAlien.sol/MintAlien.json';
import {wallet,provider} from '@/loaders/provider'
import { CsvRow,readCsvFile } from "@/interfaces/whitelist";
import env from "@/config";
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

interface Attribute {
	trait_type: string;
	value: string;
	display_type?: string;
	max_value?: number;
}
  
  interface InputData {
	name: string;
	symbol: string;
	description: string;
	seller_fee_basis_points: number;
	image: string;
	external_url: string;
	attributes: Attribute[];
}
  
interface BaseJson {
    name: string;
    description: string;
    externalUri: string;
    external_url: string;
    image: string;
    mediaUri: string;
    thumbnailUri?: string;
    preferThumb?: boolean;
	attributes: [
		{
		  label?: string,
		  type?:  string,
		  value?:  string|number,
		  trait_type?:  string,
		}
	];
}

interface WhitelistFileCsv {
	fileName:string;
	headers:string[]
}


class fileService {

	IPFS_ID="QmR4hbos2NYGDb1vDfXqzs2LKhMFiphgT6jMU836eY7rBy/mooner"
	EXTERNAL_URL = "https://moon.villas"
	IMAGE = `ipfs://${this.IPFS_ID}`
	MEDIA_URI = `ipfs://${this.IPFS_ID}`
	THUMBNAIL_URI = `ipfs://${this.IPFS_ID}/thumb`

	passportBaseJson:BaseJson = {
		name: "Passport",
		externalUri: "valocracy.xyz",
		external_url: "valocracy.xyz",
		description: 'Passport Valocracy',
		image: `ipfs://${this.IPFS_ID}/image/catalog/passport`,
		mediaUri: `ipfs://${this.IPFS_ID}/image/catalog/passport`,
		attributes: [
			{
				label: "Origin",
				type: "string",
				value: "Brazil",
				trait_type: "Origin"
			}
		]
	}

	removeNumberSuffix(input: string): string {
		// Usa uma expressão regular para remover o espaço, "#" e qualquer número que o siga
		return input.replace(/\s+#\d+$/, '');
	}

	async generateJsonFiles () {

		const inputDir ='/home/monkey/Área de Trabalho/metadata';
		const outputDir ='/home/monkey/Área de Trabalho/ipfs metadados/Passport json/json/mooner';
		// Lê todos os arquivos do diretório de entrada
		const files = fs.readdirSync(inputDir);
    
		// Filtra apenas os arquivos JSON
		const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

		const arrayRarity:string[] = []
		let index = 0
		let text = ''
		for (const file of jsonFiles) {

			index ++;

			const inputPath = path.join(inputDir, file);
			const outputPath = path.join(outputDir, file);

			const fileName = file.replace('json','png')

			//console.log({fileName})

			// Lê o conteúdo do arquivo
			const content = fs.readFileSync(inputPath, 'utf-8');
			const data: InputData = JSON.parse(content);
			 
			// Processa os dados (exemplo simples)
			const rarity = data.attributes.find(e => e.trait_type === "Rarity Rank")?.value

			if(!rarity) throw `RARIDADE NÃO ENCONTRADA index: ${index}, name: ${data.name}, ${rarity}`

			const processedData: BaseJson = {
			   name: `${this.removeNumberSuffix(data.name)} #${rarity}`,
			   description: data.description,
			   external_url:this.EXTERNAL_URL,
			   externalUri:this.EXTERNAL_URL,
			   image:this.THUMBNAIL_URI+'/'+fileName,
			   mediaUri: this.MEDIA_URI+'/'+fileName,
			   thumbnailUri: this.THUMBNAIL_URI+'/'+fileName,
			   preferThumb:true,
			   attributes:[{}]
			};

			//console.log('N°:',index, 'RARITY:',rarity, 'IMAGE:',this.THUMBNAIL_URI+'/'+fileName)
			
			
			arrayRarity[Number(rarity)] = `N°: ${index} | RARITY: ${rarity} |'IMAGE: https://valocracy-passport.myfilebase.com/ipfs/${this.IPFS_ID}/thumb/${fileName}\n`


			// data.attributes.map((e,i) => {
			// 	const valuReplace = e.trait_type != 'Base' ? String(e.value).replace(/\s*\(verificar\)/i, "") : 'Default'
			// 	//console.log({valuReplace})

				

			// 	if(i == 0){
			// 		return processedData.attributes = [{
			// 			label: e.trait_type,
			// 			value: e?.display_type == "number" ? Number(valuReplace) : valuReplace,
			// 			type: e?.display_type ?? 'string',
			// 			trait_type:  e.trait_type
			// 		}]

			// 	}

			// 	return processedData.attributes.push({
			// 		label: e.trait_type,
			// 		value: valuReplace,
			// 		type: e?.display_type ?? 'string',
			// 		trait_type:  e.trait_type
			// 	});
			// })
			 
		
			//console.log(`Arquivo ${fileName} criado com sucesso.`);

		}

		arrayRarity.map(e => {
			text = text+e
		})

		fs.writeFileSync('./rarity.txt', text);
		
	};

	async createFiles(type:string,numberFiles:number) {
	
		await this.generateJsonFiles();
		
	}

	async  readCsvFile(whitelist: WhitelistFileCsv[]): Promise<readCsvFile[]> {
		const dataFilesCsv: readCsvFile[] = [];
	  
		await Promise.all(whitelist.map(async (e) => {
		  const dataFile = await new Promise<CsvRow[]>((resolve, reject) => {
			const results: CsvRow[] = [];
			fs.createReadStream(`/home/monkey/Área de Trabalho/wallets/${e.fileName}.csv`)
			  .pipe(csv({ skipLines: 1, headers: e.headers }))
			  .on('data', (data: CsvRow) => results.push(data))
			  .on('end', () => resolve(results))
			  .on('error', (error) => reject(error));
		  });
	  
		  dataFilesCsv.push({ fileName: e.fileName, csvRow: dataFile });
		}));
	  
		return dataFilesCsv;
	  }

}

export default new fileService();
