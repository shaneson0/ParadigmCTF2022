

const { ethers } = require("hardhat");

async function getWETHBalance(WETH, address) {
    return await WETH.balanceOf(address)
}

// Setup deployed to: 0xB22C255250d74B0ADD1bfB936676D2a299BF48Bd
async function main() {

    // Prepare
    const setupAddress = "0xB22C255250d74B0ADD1bfB936676D2a299BF48Bd"
    const wethAddres = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const weth = await ethers.getContractAt("MockERC20", wethAddres)
    const setup = await ethers.getContractAt("Setup", setupAddress)
    const  mcHelperAddress = await setup.mcHelper()
    const mcHelper = await ethers.getContractAt("MasterChefHelper", mcHelperAddress)
    const balance = await getWETHBalance(weth, mcHelperAddress)

    console.log("Before balance >>>  ", balance)
    

    // Solve
    



    // 



    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });





  
