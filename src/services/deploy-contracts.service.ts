import {main} from "../../scripts/run-deploy"

class deployContractService {


	async passportAlien() {
	
		const response = await main()
		
		return response
	}


}

export default new deployContractService();
