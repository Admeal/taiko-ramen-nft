import { ethers } from "hardhat";
import { parse } from "dotenv";
import { readFileSync, appendFileSync } from "fs";
import hre from "hardhat";

async function main() {
  const net = hre.network.name;

  let config = parse(readFileSync(`.env-${net}`))
  for (const parameter in config) {
      process.env[parameter] = config[parameter];
  }

  // token 
  const TaikoRamen = await ethers.getContractFactory("TaikoRamen");
  const taikoRamen = await TaikoRamen.deploy(config.MAX_SUPPLY, config.PRICE, config.URL);
  await taikoRamen.deployed();
  console.log(`Address of token ${taikoRamen.address}`);

  appendFileSync(
      `.env-${net}`,
      `\r\# TaikoRamen deployed at \rTOKEN_CONTRACT_ADDRESS=${taikoRamen.address}\r`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
