import { ethers } from "hardhat";

async function main() {
  // Replace with token deployed
  const TokenAddress = "0x12102898F38Ab89F5e60d5FBE1084De476d673E7";

  const Swap = await ethers.getContractFactory("Swap");
  const swap = await Swap.deploy(TokenAddress);

  await swap.deployed();
  console.log("Swap deployed to:", swap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
