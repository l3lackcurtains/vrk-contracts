import { ethers } from "hardhat";

async function main() {
  const Token = await ethers.getContractFactory("Token");
  const tkn = await Token.deploy();

  await tkn.deployed();

  console.log("Token deployed to:", tkn.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
