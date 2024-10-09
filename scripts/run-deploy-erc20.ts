import { deployContract } from "./deploy/deployContract";

const deploy = async () => {

    await deployContract(1000000000,"LpValocracy"),
    await deployContract(1000000000,"USDT")
}

deploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

