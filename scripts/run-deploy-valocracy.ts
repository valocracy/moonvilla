import { deployValocracy,deployLpPassport,deployTest,deployBalance} from "./deploy/deployValocracy";

const main = async () => {
    
    const contractLp = await deployLpPassport()
    await deployValocracy(contractLp.contractAddress)

    //await deployBalance()

    // await deployTest()

    //await verify("0xaa44F54740381675F03476d3d964e90846c3941d","0x250aA92B5A267559C8D08DbF7828ae7F14c0aDa4")
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
