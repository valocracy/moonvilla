import {ethers,ContractTransactionReceipt} from 'ethers'; // Load Ethers library

class gasService {

	async transactionGasCost(receipt:ContractTransactionReceipt | null) {

		let actualCost = 0
		if(receipt){
			const actualGasUsed = receipt.gasUsed;
			const actualGasPrice = receipt.gasPrice;
			actualCost = Number(ethers.formatEther(actualGasUsed * actualGasPrice))

			console.log('\n=====')
			console.log('Actual gas used:', actualGasUsed.toString());
			console.log('Actual gas price:', ethers.formatUnits(actualGasPrice, 'gwei'), 'gwei');
			console.log('Actual cost:', actualCost, 'ETH');
			
		}

		return actualCost
		
	}

}

export default new gasService();
