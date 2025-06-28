// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/P2P.sol";
import "../src/KRNL.sol";

contract TestP2P is Script {
    // Chainanalysis response structure - Fields in alphabetical order to match API
    struct ChainanalysisResponse {
        string risk;                    // API field: "risk"
        string riskReason;              // API field: "riskReason"
        string status;                  // API field: "status"
        string walletAddress;           // API field: "walletAddress"
    }

    // Use the KernelResponse struct from KRNL.sol

    // Test case structure
    struct TestCase {
        string name;
        string risk;
        string riskReason;
        string status;
        string walletAddress;
        bool expectedVerification;
    }

    // Main function to run the test script
    function run() external {
        console.log("\n=== P2P Contract Test Script ===");
        console.log("This script generates test payloads for P2P contract and simulates verification outcomes");
        
        // Run test cases
        runTestCases();
        
        // Show how to use the script
        console.log("\n=== Usage Instructions ===");
        console.log("To test with a specific KRNL payload:");
        console.log("forge script script/TestP2P.s.sol:TestP2P --sig \"decodeP2PPayload(bytes)\" <your_hex_data> -vvv");
    }

    // Run predefined test cases
    function runTestCases() public {
        console.log("\n=== Running Test Cases ===");
        
        // Define test cases
        TestCase[] memory testCases = new TestCase[](4);
        
        // Low risk - should pass
        testCases[0] = TestCase({
            name: "Low Risk Wallet",
            risk: "Low",
            riskReason: "No significant risk indicators detected",
            status: "COMPLETE",
            walletAddress: "0xEfC315AEbEe513b9E6963C997D18C4d79830D6d1",
            expectedVerification: true
        });
        
        // Medium risk - should pass with restrictions
        testCases[1] = TestCase({
            name: "Medium Risk Wallet",
            risk: "Medium",
            riskReason: "Some suspicious activity detected",
            status: "COMPLETE",
            walletAddress: "0x8c1eD7e19abAa9f23c476dA86Dc1577F1Ef401f5",
            expectedVerification: true
        });
        
        // High risk - should fail
        testCases[2] = TestCase({
            name: "High Risk Wallet",
            risk: "High",
            riskReason: "Significant suspicious activity detected",
            status: "COMPLETE",
            walletAddress: "0x9B73845fe8eEE83f152eeE0b1F8B4950e3a50876",
            expectedVerification: false
        });
        
        // Severe risk - should fail
        testCases[3] = TestCase({
            name: "Severe Risk Wallet",
            risk: "Severe",
            riskReason: "Known illicit activity detected",
            status: "COMPLETE",
            walletAddress: "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
            expectedVerification: false
        });
        
        // Run each test case
        for (uint i = 0; i < testCases.length; i++) {
            TestCase memory tc = testCases[i];
            console.log("\n--- Test Case:", tc.name, "---");
            
            // Generate test payload
            bytes memory payload = generateTestPayload(
                tc.risk,
                tc.riskReason,
                tc.status,
                tc.walletAddress
            );
            
            // Analyze the payload
            analyzeP2PPayload(payload, tc.expectedVerification);
        }
    }

    // Generate a test KRNL payload for P2P contract
    function generateTestPayload(
        string memory risk,
        string memory riskReason,
        string memory status,
        string memory walletAddress
    ) public pure returns (bytes memory) {
        // Create Chainanalysis response
        ChainanalysisResponse memory response = ChainanalysisResponse({
            risk: risk,
            riskReason: riskReason,
            status: status,
            walletAddress: walletAddress
        });
        
        // Create kernel response with Chainanalysis data
        KernelResponse[] memory kernelResponses = new KernelResponse[](1);
        kernelResponses[0].kernelId = 1672; // Using the kernel ID from P2P contract
        kernelResponses[0].result = abi.encode(response);
        kernelResponses[0].err = "";
        
        // Encode the kernel responses array
        bytes memory encodedResponses = abi.encode(kernelResponses);
        
        return encodedResponses;
    }

    // Decode and analyze a P2P payload
    function decodeP2PPayload(bytes memory encodedData) external {
        analyzeP2PPayload(encodedData, true);
    }

    // Analyze a P2P payload and check verification outcome
    function analyzeP2PPayload(bytes memory encodedData, bool expectedVerification) public {
        console.log("\n=== P2P Payload Analysis ===");
        console.log("Encoded data length:", encodedData.length);
        
        // Decode the KRNL response array
        KernelResponse[] memory kernelResponses = abi.decode(encodedData, (KernelResponse[]));
        console.log("Number of kernel responses:", kernelResponses.length);
        
        // Look for Chainanalysis kernel (ID 1672 as used in P2P contract)
        bool chainanalysisFound = false;
        
        for (uint i = 0; i < kernelResponses.length; i++) {
            console.log("Kernel", i, "ID:", kernelResponses[i].kernelId);
            console.log("Kernel", i, "result length:", kernelResponses[i].result.length);
            
            // Check if this is the Chainanalysis kernel
            if (kernelResponses[i].kernelId == 1672) {
                chainanalysisFound = true;
                console.log("Found Chainanalysis kernel at index", i);
                
                // Decode the Chainanalysis response
                decodeChainanalysisResult(kernelResponses[i].result, expectedVerification);
                break;
            }
        }
        
        if (!chainanalysisFound) {
            console.log("Chainanalysis kernel not found (ID 1672)");
            console.log("Available kernel IDs:");
            for (uint i = 0; i < kernelResponses.length; i++) {
                console.log("  -", kernelResponses[i].kernelId);
            }
        }
    }

    // Decode Chainanalysis result and simulate P2P contract verification
    function decodeChainanalysisResult(bytes memory chainanalysisData, bool expectedVerification) public view {
        console.log("\n=== Chainanalysis Response Decode ===");
        console.log("Chainanalysis data length:", chainanalysisData.length);
        
        // Decode the Chainanalysis response
        ChainanalysisResponse memory response = abi.decode(chainanalysisData, (ChainanalysisResponse));
        
        console.log("\n=== Decoded Chainanalysis Response ===");
        console.log("Risk Level:", response.risk);
        console.log("Risk Reason:", response.riskReason);
        console.log("Status:", response.status);
        console.log("Wallet Address:", response.walletAddress);
        
        // Simulate P2P contract verification logic
        bool isVerified = simulateP2PVerification(response);
        
        console.log("\n=== P2P Verification Simulation ===");
        console.log("Is Wallet Verified:", isVerified);
        
        if (isVerified) {
            console.log("APPROVED: Wallet can create listings");
            
            // Check if medium risk - would have restrictions
            if (keccak256(bytes(response.risk)) == keccak256(bytes("Medium"))) {
                console.log("Note: Medium risk sellers are limited to 5 ETH listings");
            }
        } else {
            console.log("REJECTED: Wallet denied access");
            console.log("Reason:", response.riskReason);
        }
        
        // Check if outcome matches expected verification
        console.log("\n=== Test Outcome ===");
        if (isVerified == expectedVerification) {
            console.log("[PASS] TEST PASSED: Verification outcome matches expected result");
        } else {
            console.log("[FAIL] TEST FAILED: Verification outcome does not match expected result");
            console.log("  Expected:", expectedVerification);
            console.log("  Actual:", isVerified);
        }
    }

    // Simulate P2P contract verification logic
    function simulateP2PVerification(ChainanalysisResponse memory response) public pure returns (bool) {
        // This replicates the verification logic in P2P._processSellerVerification
        if (keccak256(bytes(response.risk)) == keccak256(bytes("Low"))) {
            return true;
        } else if (keccak256(bytes(response.risk)) == keccak256(bytes("Medium"))) {
            // Medium risk is allowed but with restrictions (handled elsewhere)
            return true;
        } else if (keccak256(bytes(response.risk)) == keccak256(bytes("High"))) {
            return false;
        } else if (keccak256(bytes(response.risk)) == keccak256(bytes("Severe"))) {
            return false;
        }
        
        // Default to false for unknown risk levels
        return false;
    }

    // Generate a complete mock KrnlPayload for P2P.createListing
    function generateMockKrnlPayload(
        string memory risk,
        string memory riskReason,
        string memory walletAddress
    ) public pure returns (KrnlPayload memory) {
        // Create Chainanalysis response
        ChainanalysisResponse memory response = ChainanalysisResponse({
            risk: risk,
            riskReason: riskReason,
            status: "COMPLETE",
            walletAddress: walletAddress
        });
        
        // Create kernel response with Chainanalysis data
        KernelResponse[] memory kernelResponses = new KernelResponse[](1);
        kernelResponses[0].kernelId = 1672;
        kernelResponses[0].result = abi.encode(response);
        kernelResponses[0].err = "";
        
        // Encode the kernel responses array
        bytes memory encodedResponses = abi.encode(kernelResponses);
        
        // Mock kernel parameters (these would normally come from KRNL)
        bytes memory kernelParams = bytes("mock_kernel_params");
        
        // Mock auth data (this would normally be signed by TokenAuthority)
        bytes memory auth = bytes("mock_auth_data");
        
        // Create the full KrnlPayload
        KrnlPayload memory payload = KrnlPayload({
            auth: auth,
            kernelResponses: encodedResponses,
            kernelParams: kernelParams
        });
        
        return payload;
    }

    // Simulate P2P.createListing parameters
    function simulateCreateListingParams() public pure returns (
        string memory verificationId,
        string memory assetType,
        string memory assetName,
        string memory gameTitle,
        uint256 price
    ) {
        return (
            "verification_123",
            "weapon",
            "Legendary Sword",
            "Crypto Quest",
            1 ether
        );
    }

    // Encode function parameters for P2P.createListing
    function encodeCreateListingParams(
        string memory verificationId,
        string memory assetType,
        string memory assetName,
        string memory gameTitle,
        uint256 price
    ) public pure returns (bytes memory) {
        return abi.encode(verificationId, assetType, assetName, gameTitle, price);
    }
}
