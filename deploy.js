const { ethers, JsonRpcProvider, Wallet, ContractFactory, formatEther } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
    const provider = new JsonRpcProvider(process.env.RPC_URL, false);
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const balance = await provider.getBalance(process.env.WALLET_ADDRESS);
    console.log("Balance:", formatEther(balance));

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

    const factory = new ContractFactory(abi, binary, wallet);
    console.log("Deploying the contract");
    const contract = await factory.deploy();
    const deploymentReciept = await contract.deploymentTransaction();
    console.log("Contract deployed to Recipt:", deploymentReciept);


    const currentFavoriteNumber = await contract.retrieve();
    console.log("Current Favorite Number:", currentFavoriteNumber.toString());
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse;
    const updateFavoraiteNumber = await contract.retrieve();
    console.log("Updated Favorite Number:", updateFavoraiteNumber.toString());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })