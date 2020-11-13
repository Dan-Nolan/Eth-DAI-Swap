const { assert } = require("chai");

const routerAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const mcdAddr = "0x6b175474e89094c44da98b954eedeac495271d0f";

describe("DaiVault", function() {
  it("should allow us to swap ETH for DAI", async function() {
    const signer1 = ethers.provider.getSigner(0);
    const UniswapRouter = await ethers.getContractFactory('UniswapV2Router02');
    const uniswapRouter = UniswapRouter.attach(routerAddr);

    const daiAmount = 100;
    const path = [await uniswapRouter.WETH(), mcdAddr];
    const [requiredEth, _] = await uniswapRouter.getAmountsIn(daiAmount, path);
    const deadline = Math.floor(Date.now() / 1000) + 60;
    await uniswapRouter.swapETHForExactTokens(daiAmount, path, signer1.getAddress(), deadline, {
      value: requiredEth
    });
    const ERC20 = await ethers.getContractFactory('ERC20');
    const erc20 = ERC20.attach(mcdAddr);
    const balance = await erc20.balanceOf(signer1.getAddress());
    console.log(balance.toString());
  });
});
