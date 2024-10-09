
import {provider} from '@/loaders/provider'
import mint_alienService from './mint_alien.service';
//import env from "@/config";

class memPoolService {

    monitorMempool = async () => {
        try {
          provider.on('pending', async (txHash: string) => {
            try {
              const transaction = await provider.getTransaction(txHash);
              if (transaction) {
                console.log(`Transação pendente: ${txHash}`);
                console.log(transaction);

                if(transaction.from == '0x992AAeb878fEAF573E9717Ed375383955549f642'){
                    console.log('\n\n\nDALEEEEEEEEEEEEEE\n\n\n')
                    const receipt  = mint_alienService.MintAlienContract.interface.decodeFunctionData('setLevelStatus',transaction.data)
                    console.log(receipt)
                    console.log('\n\n\nDALEEEEEEEEEEEEEE\n\n\n')
                }
              }
            } catch (error) {
              console.error(`Erro ao buscar a transação: ${error}`);
            }
          });
        } catch (error:any) {
          if (error.code === 'UNKNOWN_ERROR' && error.error?.code === -32603) {
            console.error('Erro de filtro não existente. Reiniciando a conexão...');
            // Recursivamente chamar a função para reiniciar o monitoramento
            this.monitorMempool();
          } else {
            console.error('Erro inesperado:', error);
          }
        }
      };
}

export default new memPoolService();
