
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const SetupDeploy = await hre.ethers.getContractFactory("Setup");
  const Setup = await SetupDeploy.deploy({value: ethers.utils.parseEther("10")});
  await Setup.deployed();

  console.log("Setup deployed to:", Setup.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });





  