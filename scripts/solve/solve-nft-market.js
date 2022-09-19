const { ethers, upgrades } = require('hardhat');
const { expect } = require('chai');
require("../util");

describe('[Challenge] resucue', function () {
    let nftMarket;
    let shaneson;

    before(async function () {
        // localhost；0xb3Df02AF5FbC5579D6D7eBfC4F0F70e7Ef126E52
        // game: 0x7B8CAeA73F647F3062b21B940BaAD6B43492FeaB

        // nftMarket = await ethers.getContractAt("TctfMarket", "0xb3Df02AF5FbC5579D6D7eBfC4F0F70e7Ef126E52");

        const TctfMarket = await ethers.getContractFactory("TctfMarket");
        const tctfMarket = await TctfMarket.deploy();
        await tctfMarket.deployed();
        
        const result = await tctfMarket.getOrder(0);
        console.log(result);

        shaneson = await ethers.getSigner(1);
    });

    it('Exploit', async function () {    
        
        //  Focus on: require(ecrecover(keccak256(serialized), sig.v, sig.rs[0], sig.rs[1]) == coupon.issuer, "Invalid signature");





    });

    after(async function () {
    });
});