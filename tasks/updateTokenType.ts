import { task } from 'hardhat/config'
import { readFileSync } from "fs";
import { parse } from "dotenv";

task('updateTokenType', 'Update the token type')
    .addParam('tokenType', 'Token type id in numeric format')
    .setAction(async ({ tokenType }, hre) => {
        const net = hre.network.name;
        let config = parse(readFileSync(`.env-${net}`));
        for (const parameter in config) {
            process.env[parameter] = config[parameter] as string;
        }

        if(!config.TOKEN_CONTRACT_ADDRESS) {
            throw new Error(`Please set or deploy TOKEN_CONTRACT_ADDRESS in a .env-${net} file`);
        }
        const Token = await hre.ethers.getContractFactory("TaikoRamen");
        const token = await Token.attach(config.TOKEN_CONTRACT_ADDRESS);

        const currnetTokenType = await token.tokenTypes(tokenType);
        const price = currnetTokenType.pricePerCopy;
        const maxCopies = currnetTokenType.maxSupply;
        const uri = config.URL;

        const tx = await token.updateTokenType(tokenType, maxCopies, price, uri);
        console.log(`Updated "${tokenType}" token type in tx hash ${tx.hash}`);
    });
