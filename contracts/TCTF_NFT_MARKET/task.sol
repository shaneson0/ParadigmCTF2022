// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract TctfNFT is ERC721, Ownable {
    constructor() ERC721("TctfNFT", "TNFT") {
        _setApprovalForAll(address(this), msg.sender, true);
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }
}

contract TctfToken is ERC20 {
    bool airdropped;

    constructor() ERC20("TctfToken", "TTK") {
        _mint(address(this), 100000000000);
        _mint(msg.sender, 1337);
    }

    function airdrop() external {
        require(!airdropped, "Already airdropped");
        airdropped = true;
        _mint(msg.sender, 5);
    }
}

struct Order {
    address nftAddress;
    uint256 tokenId;
    uint256 price;
}
struct Coupon {
    uint256 orderId;
    uint256 newprice;
    address issuer;
    address user;
    bytes reason;
}
struct Signature {
    uint8 v;
    bytes32[2] rs;
}
struct SignedCoupon {
    Coupon coupon;
    Signature signature;
}

contract TctfMarket {
    event SendFlag();
    event NFTListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFTCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event NFTBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    bool tested;
    TctfNFT public tctfNFT;
    TctfToken public tctfToken;
    CouponVerifierBeta public verifier;
    Order[] orders;

    constructor() {
        tctfToken = new TctfToken();
        tctfToken.approve(address(this), type(uint256).max);

        tctfNFT = new TctfNFT();
        tctfNFT.mint(address(tctfNFT), 1);
        tctfNFT.mint(address(this), 2);
        tctfNFT.mint(address(this), 3);

        verifier = new CouponVerifierBeta();

        orders.push(Order(address(tctfNFT), 1, 1));
        orders.push(Order(address(tctfNFT), 2, 1337));
        orders.push(Order(address(tctfNFT), 3, 13333333337));
    }

    function getOrder(uint256 orderId) public view returns (Order memory order) {
        require(orderId < orders.length, "Invalid orderId");
        order = orders[orderId];        
    }

    function createOrder(address nftAddress, uint256 tokenId, uint256 price) external returns(uint256) {
        require(price > 0, "Invalid price");
        require(isNFTApprovedOrOwner(nftAddress, msg.sender, tokenId), "Not owner");
        orders.push(Order(nftAddress, tokenId, price));
        emit NFTListed(msg.sender, nftAddress, tokenId, price);
        return orders.length - 1;
    }

    function cancelOrder(uint256 orderId) external {
        Order memory order = getOrder(orderId);
        require(isNFTApprovedOrOwner(order.nftAddress, msg.sender, order.tokenId), "Not owner");
        _deleteOrder(orderId);
        emit NFTCanceled(msg.sender, order.nftAddress, order.tokenId);
    }

    function purchaseOrder(uint256 orderId) external {
        Order memory order = getOrder(orderId);
        _deleteOrder(orderId);
        IERC721 nft = IERC721(order.nftAddress);
        address owner = nft.ownerOf(order.tokenId);
        tctfToken.transferFrom(msg.sender, owner, order.price);
        nft.safeTransferFrom(owner, msg.sender, order.tokenId);
        emit NFTBought(msg.sender, order.nftAddress, order.tokenId, order.price);
    }

    function purchaseWithCoupon(SignedCoupon calldata scoupon) external {
        Coupon memory coupon = scoupon.coupon;
        console.log(coupon.user);
        require(coupon.user == msg.sender, "Invalid user");
        require(coupon.newprice > 0, "Invalid price");
        verifier.verifyCoupon(scoupon);
        Order memory order = getOrder(coupon.orderId);
        console.log(order.tokenId);

        _deleteOrder(coupon.orderId);
        IERC721 nft = IERC721(order.nftAddress);
        address owner = nft.ownerOf(order.tokenId);
        tctfToken.transferFrom(coupon.user, owner, coupon.newprice);
        nft.safeTransferFrom(owner, coupon.user, order.tokenId);
        emit NFTBought(coupon.user, order.nftAddress, order.tokenId, coupon.newprice);
    }

    function purchaseTest(address nftAddress, uint256 tokenId, uint256 price) external {
        require(!tested, "Tested");
        tested = true;
        IERC721 nft = IERC721(nftAddress);
        uint256 orderId = TctfMarket(this).createOrder(nftAddress, tokenId, price);
        nft.approve(address(this), tokenId);
        TctfMarket(this).purchaseOrder(orderId);
    }

    function win() external {
        require(tctfNFT.ownerOf(1) == msg.sender && tctfNFT.ownerOf(2) == msg.sender && tctfNFT.ownerOf(3) == msg.sender);
        emit SendFlag();
    }

    function isNFTApprovedOrOwner(address nftAddress, address spender, uint256 tokenId) internal view returns (bool) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        return (spender == owner || nft.isApprovedForAll(owner, spender) || nft.getApproved(tokenId) == spender);
    }

    function _deleteOrder(uint256 orderId) internal {
        orders[orderId] = orders[orders.length - 1];
        orders.pop();
    }

    function onERC721Received(address, address, uint256, bytes memory) public pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

contract CouponVerifierBeta {
    TctfMarket market;
    bool tested;

    constructor() {
        market = TctfMarket(msg.sender);
    }

    function  verifyCouponTest(uint256 orderId, address issuer, address user, uint256 newprice, bytes memory reason) public view returns (bytes memory serialized){
        Order memory order = market.getOrder(orderId);
        serialized = abi.encode(
            "I, the issuer", issuer,
            "offer a special discount for", user,
            "to buy", order, "at", newprice,
            "because", reason
        );
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    function verifyCoupon(SignedCoupon calldata scoupon) public {
        require(!tested, "Tested");
        tested = true;
        Coupon memory coupon = scoupon.coupon;
        Signature memory sig = scoupon.signature;
        Order memory order = market.getOrder(coupon.orderId);
        bytes memory serialized = abi.encode(
            "I, the issuer", coupon.issuer,
            "offer a special discount for", coupon.user,
            "to buy", order, "at", coupon.newprice,
            "because", coupon.reason 
        );


        bytes32 _signMsg = keccak256(serialized);
        // console.log(coupon.orderId);
        // console.log(coupon.issuer);
        console.logBytes(serialized);



        // IERC721 nft = IERC721(order.nftAddress);
        // address owner = nft.ownerOf(order.tokenId);
        
        // require(coupon.issuer == owner, "Invalid issuer");
        
        // address _realAddress =  ecrecover(keccak256(serialized), sig.v, sig.rs[0], sig.rs[1]);
        // console.log(_realAddress);
        // require( _realAddress == coupon.issuer, "Invalid signature");
    }
}
