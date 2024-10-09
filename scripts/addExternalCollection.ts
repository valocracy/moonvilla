import { network } from 'hardhat';
import { getRegistry } from './get-gegistry';

export async function addExternalCollection() 
{

  if(network.name != 'moonbeam') throw 'Network is not moobeam'

  const registry = await getRegistry();

  try {

    await registry.addExternalCollection(
      "0x5e3968aDE98dEbe34B3F740Bf47181a1DBe6bfC2",
      "ipfs://Qme2n7zswtQBKSJDMx2JVRQqnN1fvPUjH8XYRciS6VrGp5/mooner/mooner-collection.json"
    );

    console.log('Collection added to Singular Registry ');
    
  } catch (error) {

    if (error instanceof Error) {
      // console.error("Erro detalhado:", error.message);
    
      // Se o erro for do tipo ethers.errors.TransactionError, podemos tentar decodificar
      if ('data' in error) {

        console.log(error)
        
        try {
          const decodedError = registry.interface.parseError(String(error.data));
          console.log("Erro decodificado:", decodedError);
        } catch (decodeError) {
          console.log("Não foi possível decodificar o erro:", decodeError);
        }
      }
    } else {
      console.error("Ocorreu um erro desconhecido:", error);
    }
    
  }



}

addExternalCollection().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
