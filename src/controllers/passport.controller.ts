import { Request, Response, } from "express";
import { network } from 'hardhat';
import Controller from "./controller";
import service from "@/services/passport.service";
import serviceDeploy from "@/services/deploy-contracts.service";
import passportService from "@/services/passport.service";
import { whitelist,mintStatus,configMintAlien,startMintAlien } from "@/interfaces/whitelist";
//import MysqlService from "@/services/mysql.service";
import { getErrorMessage, getSuccessMessage } from "@/helpers/response.collection";
import catalogService from "@/services/catalog.service";
import alienService from "@/services/alien.service";
import env from "@/config";

class mintAlienController extends Controller{

	async error(req: Request, res: Response) {
		try {

			await service.error()
			
			return this.sendSuccessResponse(res, {message:'DALE MINT'});
		} catch (err) {

			this.sendErrorMessage(res, err, 'mintAlienController');
      	}
	}

}

export default new mintAlienController();