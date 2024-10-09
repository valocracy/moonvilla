import { Request, Response, } from "express";
import { network } from 'hardhat';
import Controller from "./controller";
import service from "@/services/mint_alien.service";
import serviceDeploy from "@/services/deploy-contracts.service";
import passportService from "@/services/passport.service";
import { whitelist,mintStatus,configMintAlien,startMintAlien } from "@/interfaces/whitelist";
//import MysqlService from "@/services/mysql.service";
import { getErrorMessage, getSuccessMessage } from "@/helpers/response.collection";
import catalogService from "@/services/catalog.service";
import alienService from "@/services/alien.service";
import env from "@/config";

class mintAlienController extends Controller{

	async mint(req: Request, res: Response) {
		try {

			await service.mint()
			
			return this.sendSuccessResponse(res, {message:'DALE MINT'});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async setWhitelistAddress(req: Request, res: Response) {
		try {

			const body:whitelist = req.body;
			if (!body?.whitelist) throw Error(getErrorMessage('missingField', 'whitelist'));
			if (!body?.address || body.address.length == 0) throw Error(getErrorMessage('missingField', 'address'));
			
			let response = await service.setWhitelistAddress(body)
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async setStatusMintLevel(req: Request, res: Response) {
		try {

			const body:mintStatus = req.body;
			if (!body?.whitelist) throw Error(getErrorMessage('missingField', 'whitelist'));
			//if (!body?.status) throw Error(getErrorMessage('missingField', 'status'));
			
			let response = await service.setStatusMintLevel(body)
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async getStatusMinLevel(req: Request, res: Response) {
		try {

			let response = await service.getStatusMinLevel()
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async getCurrentMint(req: Request, res: Response) {
		try {

			let response = await service.getCurrentMint()
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}


	async setConfigMintAlien(req: Request, res: Response) {
		try {

			const body:configMintAlien = req.body;
			if (!body?.alien_address) throw Error(getErrorMessage('missingField', 'alien_address'));
			if (!body?.passport_address) throw Error(getErrorMessage('missingField', 'passport_address'));
			if (!body?.catalog_address) throw Error(getErrorMessage('missingField', 'catalog_address'));

			let response = await service.setConfigMintAlien(body)
			
			return this.sendSuccessResponse(res, {message:'config mint alien sucess'});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async mintAlienWhitelist(req: Request, res: Response) {
		try {

			let response = await service.mintAlienWhitelist()
			
			return this.sendSuccessResponse(res, {message:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async setWhistelistByCSVFile(req: Request, res: Response) {
		try {

			let response = await service.setWhistelistByCSVFile()
			
			return this.sendSuccessResponse(res, {message:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async whitelistCount(req: Request, res: Response) {
		try {

			let response = await service.whitelistCount()
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

	async start(req: Request, res: Response) {
		try {
			
			let deploy:configMintAlien;

			if(env.DEVELOPMENT){
				console.log('\n\n -- DEPLOY HARDHAT -- \n\n')
				await network.provider.send("hardhat_reset")
				deploy = await serviceDeploy.passportAlien()
			}
			
			const costSetAuto = await passportService.setAutoAcceptCollection()
			console.log('- Alien address setAutoAcceptCollection\n')

			const costConfigCatalog = await catalogService.configureCatalog()
			console.log('- Catalogo configurado\n')

			const costManageContributor = await alienService.manageContributor()
			console.log('- MintAlien adicionado como contribuido No Alien\n')

			const costValidParentForEquippableGroup = await alienService.setValidParentForEquippableGroup()
			console.log('- SetValidParentForEquippableGroup\n')
			
			//Seta os endereços do contrato de mint alien
			const costConfigMintAlien = await service.setConfigMintAlien({
				alien_address:env.ALIEN_CONTRACT_ADDRESS,
				passport_address:env.PASSPORT_CONTRACT_ADDRESS,
				catalog_address:env.CATALOG_CONTRACT_ADDRESS
			})
			console.log('- setConfigMintAlien\n')
			console.log('TOTAL COST CONFIG ->',(costSetAuto + costConfigCatalog + costManageContributor + costValidParentForEquippableGroup))
			console.log('\n\n-- DALE --\n\n')

			return this.sendSuccessResponse(res, {message:'Mint de deployado e configurado'});
			

		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

}

export default new mintAlienController();