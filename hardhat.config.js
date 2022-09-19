process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

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
    localhost: {
      url:  "http://localhost:8545",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    },
    tercentCTF: {
        url:  "http://47.102.40.39:8545",
        accounts: [`${PRIVATE_KEY}`],
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        }
      },
    eth: {
      url:  "https://rpc.ankr.com/eth",
      accounts: [`${PRIVATE_KEY}`],
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
}
