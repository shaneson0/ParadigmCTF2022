

const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const TctfMarket = await hre.ethers.getContractFactory("TctfMarket");
  const tctfMarket = await TctfMarket.deploy();
  await tctfMarket.deployed();

  console.log("tctfMarket deployed to:", tctfMarket.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });





  