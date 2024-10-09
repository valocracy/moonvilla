import { Request, Response, } from "express";
import Controller from "./controller";
import service from "@/services/writeImage.service";
import { whitelist,mintStatus,configMintAlien,startMintAlien } from "@/interfaces/whitelist";
import { getErrorMessage, getSuccessMessage } from "@/helpers/response.collection";

class WriteImage extends Controller{

	async writePassport(req: Request, res: Response) {
		try {

			const {date} = req.body

			
			let response = await service.writePassport(date)
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'WriteImage');
      	}
	}

	async addTestImage(req: Request, res: Response) {
		try {

			const {date} = req.body

			
			let response = await service.addTestImage(date)
			
			return this.sendSuccessResponse(res, {content:response});
		} catch (err) {

			this.sendErrorMessage(res, err, 'WriteImage');
      	}
	}



}

export default new WriteImage();