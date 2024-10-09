import { Request, Response, } from "express";
import Controller from "./controller";
import service from "@/services/file.service";
import { whitelist,mintStatus,configMintAlien,startMintAlien } from "@/interfaces/whitelist";
import { getErrorMessage, getSuccessMessage } from "@/helpers/response.collection";

class jsonController extends Controller{

	async createFiles(req: Request, res: Response) {
		try {

			const {type,number_files} = req.body

			
			let response = await service.createFiles(type,number_files)
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'jsonController');
      	}
	}

	async readCsvFile(req: Request, res: Response) {
		try {
			
			//let response = await service.readCsvFile(whitelist: WhitelistFileCsv[])
			
			return this.sendSuccessResponse(res, {content:''});
		} catch (err) {

			this.sendErrorMessage(res, err, 'jsonController');
      	}
	}

}

export default new jsonController();