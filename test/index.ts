import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";

describe("Token Deployment and Swap Test", async function () {
  let token: Contract;
  let swap: Contract;
  let owner: Signer;
  const exchangeRate: number = 500;

  // Get signer
  before(async function () {
    [owner] = await ethers.getSigners();
  });

  it("Deploy token and mint total supply to creator", async function () {
    const TokenContract = await ethers.getContractFactory("Token");
    token = await TokenContract.deploy();
    const ownerBalance = await token.balanceOf(await owner.getAddress());

    // Check minted balance and totalsupply
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Deploy Swap contract", async function () {
    const SwapContract = await ethers.getContractFactory("Swap");
    swap = await SwapContract.deploy(token.address);

    // Check contract owner
    expect(await swap.owner()).to.equal(await owner.getAddress());
  });

  it("Transfer all tokens to swap contract", async function () {
    const amount = await token.totalSupply();
    await token.transfer(swap.address, amount);
    const swapBalance = await token.balanceOf(swap.address);

    // Check transferred amount
    expect(swapBalance).to.equal(amount);
  });

  it("Swap Ether to Token", async function () {
    const swapValue = 0.1; // 0.1 ETH
    const amount = ethers.utils.parseEther(swapValue.toString());

    // Get swapped amount
    const tokenAfterSwap = parseFloat(
      (swapValue * exchangeRate).toString()
    ).toFixed(18);

    await swap.swapEthToToken({ value: amount });

    // token balance after swap
    const ownerTokenBalance = await token.balanceOf(await owner.getAddress());
    const ownerTokenBalanceFormatted = parseFloat(
      ethers.utils.formatEther(ownerTokenBalance)
    ).toFixed(18);

    // Check the token amount after swap
    expect(ownerTokenBalanceFormatted).to.equal(tokenAfterSwap);
  });

  it("Approve Swap Contract in Token", async function () {
    const allowValue = 10000;
    const toApprove = ethers.utils.parseEther(allowValue.toString());
    await token.approve(swap.address, toApprove);

    const allowance = parseInt(
      ethers.utils.formatEther(
        await token.allowance(await owner.getAddress(), swap.address)
      )
    );

    // Check allowance
    expect(allowValue).to.equal(allowance);
  });

  it("Swap Token to Ether", async function () {
    const swapValue = 50; // 50 Token

    const ownerOldTokenBalance = await token.balanceOf(
      await owner.getAddress()
    );
    const ownerOldTokenBalanceFormatted =
      ethers.utils.formatEther(ownerOldTokenBalance);

    const amount = ethers.utils.parseEther(swapValue.toString());
    await swap.swapTokenToEth(amount);

    const ownerTokenBalance = await token.balanceOf(await owner.getAddress());
    const ownerTokenBalanceFormatted =
      ethers.utils.formatEther(ownerTokenBalance);

    // Check reduced token balance with balance after swap
    expect(parseFloat(ownerTokenBalanceFormatted).toFixed(18)).to.equal(
      parseFloat(
        (parseFloat(ownerOldTokenBalanceFormatted) - swapValue).toString()
      ).toFixed(18)
    );
  });
});
