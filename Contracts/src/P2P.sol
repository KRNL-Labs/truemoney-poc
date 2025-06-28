// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {KRNL, KrnlPayload, KernelParameter, KernelResponse} from "./KRNL.sol";

contract P2P is KRNL {

    address public contractOwner;
    uint256 public nextListingId = 1;
    uint256 public constant PLATFORM_FEE = 250; // 2.5% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // Token Authority public key as a constructor
    constructor(address _tokenAuthorityPublicKey) KRNL(_tokenAuthorityPublicKey) {
        contractOwner = msg.sender;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Not owner");
        _;
    }

    // Events
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        string assetType,
        string assetName,
        uint256 price,
        uint256 timestamp
    );

    event ListingCanceled(
        uint256 indexed listingId,
        address indexed seller,
        string reason,
        uint256 timestamp
    );

    event TradeExecuted(
        uint256 indexed listingId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        string riskLevel,
        uint256 timestamp
    );

    event SellerRejected(
        address indexed seller,
        string walletAddress,
        string reason,
        uint256 timestamp
    );

    // Full Chainanalysis response structure - Fields in alphabetical order to match API
    struct ChainanalysisResponse {
        string risk;                                    // API field: "risk"
        string riskReason;                              // API field: "riskReason"
        string status;                                  // API field: "status"
        string walletAddress;                           // API field: "walletAddress"
    }

    // Simplified structure for internal contract processing
    struct WalletRiskAssessment {
        string walletAddress;
        string riskLevel;           // "Low", "Medium", "High", "Severe"
        string riskReason;          // Risk explanation
        bool isVerified;            // Whether wallet passed verification
        uint256 timestamp;          // When assessment was made
    }

    // Game asset listing structure
    struct AssetListing {
        uint256 listingId;
        address seller;
        string assetType;           // "weapon", "armor", "skin", "currency", etc.
        string assetName;           // Name/description of the asset
        string gameTitle;           // Which game the asset is from
        uint256 price;              // Price in wei
        bool isActive;              // Whether listing is active
        uint256 createdAt;          // Timestamp of creation
        WalletRiskAssessment sellerRisk;  // Seller's risk assessment
    }

    // Mappings
    mapping(uint256 => AssetListing) public listings;
    mapping(address => string[]) public userVerifications;
    mapping(string => WalletRiskAssessment) public walletAssessments;
    mapping(string => ChainanalysisResponse) public fullChainanalysisResponses; // Store full response
    mapping(string => bool) public processedVerifications;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => bool) public verifiedSellers;

    // Create a new asset listing with seller verification
    function createListing(
        KrnlPayload memory krnlPayload,
        string memory verificationId,
        string memory assetType,
        string memory assetName,
        string memory gameTitle,
        uint256 price
    )
        external
        onlyAuthorized(krnlPayload, abi.encode(verificationId, assetType, assetName, gameTitle, price))
    {
        require(!processedVerifications[verificationId], "Verification already processed");
        require(price > 0, "Price must be greater than 0");
        require(bytes(assetType).length > 0, "Asset type required");
        require(bytes(assetName).length > 0, "Asset name required");
        require(bytes(gameTitle).length > 0, "Game title required");
        
        // Decode response from Chainanalysis kernel
        KernelResponse[] memory kernelResponses = abi.decode(krnlPayload.kernelResponses, (KernelResponse[]));
        
        bool kernelFound = false;
        
        for (uint i = 0; i < kernelResponses.length; i++) {
            // Replace with your actual Chainanalysis kernel ID
            if (kernelResponses[i].kernelId == 1672) {
                kernelFound = true;
                
                // Decode the Chainanalysis response with alphabetically ordered fields
                ChainanalysisResponse memory chainanalysisResponse = abi.decode(kernelResponses[i].result, (ChainanalysisResponse));
                
                // Store the wallet assessment (using the address field from API response)
                walletAssessments[verificationId] = WalletRiskAssessment({
                    walletAddress: chainanalysisResponse.walletAddress, // API field: "address"
                    riskLevel: chainanalysisResponse.risk,
                    riskReason: chainanalysisResponse.riskReason,
                    isVerified: false, // Will be set based on risk assessment
                    timestamp: block.timestamp
                });
                
                break;
            }
        }
        
        require(kernelFound, "Chainanalysis kernel response not found");
        
        // Process the seller verification and create listing
        _processSellerVerification(verificationId, assetType, assetName, gameTitle, price);
    }

    // Enhanced risk assessment with additional restrictions based on detailed Chainanalysis data
    function _processSellerVerification(
        string memory verificationId,
        string memory assetType,
        string memory assetName,
        string memory gameTitle,
        uint256 price
    ) internal {
        
        processedVerifications[verificationId] = true;
        userVerifications[msg.sender].push(verificationId);
        
        WalletRiskAssessment storage assessment = walletAssessments[verificationId];
        
        // Determine if seller is verified based on risk level and additional factors
        bool isVerified = false;
        string memory rejectionReason = "";
        
        if (keccak256(bytes(assessment.riskLevel)) == keccak256(bytes("Low"))) {
            isVerified = true;
        } else if (keccak256(bytes(assessment.riskLevel)) == keccak256(bytes("Medium"))) {
            // Allow medium risk but with restrictions based on exposures and triggers
            isVerified = true;
            require(price <= 5 ether, "Medium risk sellers limited to 5 ETH listings");
            
        } else if (keccak256(bytes(assessment.riskLevel)) == keccak256(bytes("High"))) {
            rejectionReason = "High risk wallet detected";
        } else if (keccak256(bytes(assessment.riskLevel)) == keccak256(bytes("Severe"))) {
            rejectionReason = "Severe risk wallet - listing denied";
        }
        
        assessment.isVerified = isVerified;
        
        if (isVerified) {
            // Create the listing
            uint256 listingId = nextListingId++;
            
            listings[listingId] = AssetListing({
                listingId: listingId,
                seller: msg.sender,
                assetType: assetType,
                assetName: assetName,
                gameTitle: gameTitle,
                price: price,
                isActive: true,
                createdAt: block.timestamp,
                sellerRisk: assessment
            });
            
            sellerListings[msg.sender].push(listingId);
            verifiedSellers[msg.sender] = true;
            
            emit ListingCreated(
                listingId,
                msg.sender,
                assetType,
                assetName,
                price,
                block.timestamp
            );
            
        } else {
            emit SellerRejected(
                msg.sender,
                assessment.walletAddress,
                string(abi.encodePacked(rejectionReason, ": ", assessment.riskReason)),
                block.timestamp
            );
            
            revert(string(abi.encodePacked("Seller verification failed: ", rejectionReason)));
        }
    }

    // Buy an asset from a verified seller
    function buyAsset(uint256 listingId) external payable {
        AssetListing storage listing = listings[listingId];
        
        require(listing.isActive, "Listing is not active");
        require(listing.seller != msg.sender, "Cannot buy your own listing");
        require(msg.value >= listing.price, "Insufficient payment");
        require(listing.sellerRisk.isVerified, "Seller not verified");
        
        // Calculate platform fee
        uint256 platformFee = (listing.price * PLATFORM_FEE) / BASIS_POINTS;
        uint256 sellerAmount = listing.price - platformFee;
        
        // Mark listing as inactive
        listing.isActive = false;
        
        // Transfer payment to seller
        (bool success, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(success, "Payment to seller failed");
        
        // Refund excess payment to buyer
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit TradeExecuted(
            listingId,
            listing.seller,
            msg.sender,
            listing.price,
            listing.sellerRisk.riskLevel,
            block.timestamp
        );
    }

    // Cancel a listing (only by seller)
    function cancelListing(uint256 listingId) external {
        AssetListing storage listing = listings[listingId];
        
        require(listing.seller == msg.sender, "Only seller can cancel listing");
        require(listing.isActive, "Listing is not active");
        
        listing.isActive = false;
        
        emit ListingCanceled(
            listingId,
            msg.sender,
            "Canceled by seller",
            block.timestamp
        );
    }

    // Emergency cancel listing (only by owner)
    function emergencyCancelListing(uint256 listingId, string memory reason) external onlyContractOwner {
        AssetListing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        
        listing.isActive = false;
        
        emit ListingCanceled(
            listingId,
            listing.seller,
            reason,
            block.timestamp
        );
    }

    // View functions
    function getListing(uint256 listingId) external view returns (AssetListing memory) {
        return listings[listingId];
    }

    function getSellerListings(address seller) external view returns (uint256[] memory) {
        return sellerListings[seller];
    }

    function getWalletAssessment(string memory verificationId) external view returns (WalletRiskAssessment memory) {
        return walletAssessments[verificationId];
    }

    function isSellerVerified(address seller) external view returns (bool) {
        return verifiedSellers[seller];
    }

    function getVerificationStatus(string memory verificationId) external view returns (bool processed) {
        return processedVerifications[verificationId];
    }

    function getUserVerifications(address user) external view returns (string[] memory) {
        return userVerifications[user];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getFullChainanalysisResponse(string memory verificationId) external view returns (ChainanalysisResponse memory) {
        return fullChainanalysisResponses[verificationId];
    }

    // Admin functions
    function withdrawPlatformFees() external onlyContractOwner {
        require(address(this).balance > 0, "No balance to withdraw");
        payable(contractOwner).transfer(address(this).balance);
    }

    function setContractOwner(address _contractOwner) external onlyContractOwner {
        contractOwner = _contractOwner;
    }

    function banSeller(address seller) external onlyContractOwner {
        verifiedSellers[seller] = false;
    }

    function reinstateSellerr(address seller) external onlyContractOwner {
        verifiedSellers[seller] = true;
    }

    // Function to receive ETH
    receive() external payable {}
    
    // Fallback function
    fallback() external payable {}
}