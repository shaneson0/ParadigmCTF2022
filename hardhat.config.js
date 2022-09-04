require("@nomiclabs/hardhat-waffle");


const PRIVATE_KEY = process.env.PRIVATE_KEY || 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || '';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.16",

  networks: {
    eth: {
      url: ALCHEMY_KEY == '' ? "https://rpc.ankr.com/eth" : `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
};
