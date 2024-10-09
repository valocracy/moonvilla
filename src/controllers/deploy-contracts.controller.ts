import { Request, Response, } from "express";
import Controller from "./controller";
import service from "@/services/deploy-contracts.service";
//import MysqlService from "@/services/mysql.service";
import { queryFilterBillingControl } from "@/interfaces/queryFilterBillingControl";
//import { getErrorMessage, getSuccessMessage } from "@/helpers/response.collection";
import {provider} from '@/loaders/provider'
import {main} from "../../scripts/run-deploy"


class deployController extends Controller{

	// async create(req: Request, res: Response) {
	// 	try {
	// 		await MysqlService.startTransaction();
	// 		const body = req.body;

	// 		const id = await service.create(body);

	// 		await MysqlService.commit();

	// 		return this.sendSuccessResponse(res, { content: {id:id} });
	// 	} catch (err) {
	// 		await MysqlService.rollback();
	// 		this.sendErrorMessage(res, err, 'deployController');
    //   	}
	// }
    
	async passportAlien(req: Request, res: Response) {
		try {

			const response = await service.passportAlien()
			
			return this.sendSuccessResponse(res, {content:response});

		} catch (err) {

			this.sendErrorMessage(res, err, 'deployController');
      	}
	}

}

export default new deployController();