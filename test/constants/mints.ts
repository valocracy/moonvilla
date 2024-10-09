
type MintData = {
    to:string;
    tokenURI:string;
    rarity:number;
};

type MintsData = {
    mintDatas:MintData[];
    rarityTotal:number
};

function getRandomRarity(): number {
    return Math.floor(Math.random() * 100) + 1;
}


export const getMintsDatas = (address:string,quantityMints:number):MintsData => {

    const mintDatas:MintData[] = []
    let rarityTotal = 0;

    for (let i = 0; i < quantityMints; i++) {

        const rarity = getRandomRarity();
        
        mintDatas.push({
            to:address,
            tokenURI:`dale ${i+address}`,
            rarity:rarity
        })

        rarityTotal += rarity;

        
    }

    return {
        mintDatas:mintDatas,
        rarityTotal:rarityTotal
    }

}
