/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Alien,
} from '../../../typechain-types';
import * as C from '../../../scripts/constants';

export async function mintItems(alien:Alien, chunkiesAddress: string) {
  // Pela ordem em que cunhamos os ativos, podemos saber que esses são os ids. 
  // Poderíamos ter métodos personalizados para nomes de ativos ou para definir nós mesmos os IDs dos ativos, 
  // mas como somente o emissor pode adicionar ativos, podemos confiar no pedido.
  const ALIEN = 1;
  const ALIEN2 = 2;
  const ALIEN3 = 3;
  
  // Estamos usando o ativo esquerdo como tokenURI. Este é o caminho mais simples. Alternativamente, 
  // poderíamos ter usado uma implementação customizada que não requer tokenURI no mint, 
  // mas o obtém do ativo com a prioridade mais alta ou do primeiro ativo. Ambas as opções podem ser facilmente criadas em Wizard.rmrk.dev   
  // Sending a bone NFT to the first chunky, with 2 assets, one for each hand
  let tx = await alien.nestMintWithAssets(
    chunkiesAddress, // To
    1, // destinationId
    `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien01.json`, // TokenURI,
    [ALIEN], // Assets
  );

  // tx = await alien.nestMintWithAssets(
  //   chunkiesAddress, // To
  //   2, // destinationId
  //   `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien02.json`, // TokenURI,
  //   [ALIEN2], // Assets
  // );

  tx = await alien.nestMintWithAssets(
    chunkiesAddress, // To
    1, // destinationId
    `${C.ALIEN_BASE_IPFS_URI}/json/aliens/alien03.json`, // TokenURI,
    [ALIEN3], // Assets
  );
  
  // // Sending a flag NFT to the second chunky, with 2 assets, one for each hand
  // tx = await items.nestMintWithAssets(
  //   chunkiesAddress, // To
  //   2, // destinationId
  //   `${C.BASE_IPFS_URI}/items/flag/left.json`, // TokenURI,
  //   [flagLeftAssetId, flagRightAssetId], // Assets
  // );
  // await tx.wait();
  // // Sending a pencil NFT to the third chunky, with 2 assets, one for each hand
  // tx = await items.nestMintWithAssets(
  //   chunkiesAddress, // To
  //   3, // destinationId
  //   `${C.BASE_IPFS_URI}/items/pencil/left.json`, // TokenURI,
  //   [pencilLeftAssetId, pencilRightAssetId], // Assets
  // );
  // await tx.wait();
  // // Sending a spear NFT to the fourth chunky, with 2 assets, one for each hand
  // tx = await items.nestMintWithAssets(
  //   chunkiesAddress, // To
  //   4, // destinationId
  //   `${C.BASE_IPFS_URI}/items/spear/left.json`, // TokenURI,
  //   [spearLeftAssetId, spearRightAssetId], // Assets
  // );
  // await tx.wait();
  // // Sending a spear NFT to the fifth chunky, with 2 assets, one for each hand
  // tx = await items.nestMintWithAssets(
  //   chunkiesAddress, // To
  //   5, // destinationId
  //   `${C.BASE_IPFS_URI}/items/spear/left.json`, // TokenURI,
  //   [spearLeftAssetId, spearRightAssetId], // Assets
  // );
  // await tx.wait();
  // // Sending a flag NFT to the first chunky, with 2 assets, one for each hand
  // tx = await items.nestMintWithAssets(
  //   chunkiesAddress, // To
  //   1, // destinationId
  //   `${C.BASE_IPFS_URI}/items/flag/left.json`, // TokenURI,
  //   [flagLeftAssetId, flagRightAssetId], // Assets
  // );
  // await tx.wait();
}