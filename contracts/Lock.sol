// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    // Structure representing a DID Document with an optional pointer for credentials
    struct DIDDocument {
        address owner;       // DID subject (owner)
        string doc;          // JSON string representation of the DID document
        string credentialCID; // Pointer to off-chain stored credentials (e.g., IPFS CID)
        uint256 timestamp;   // Registration timestamp
    }

    // Mapping from an owner address to its DID document
    mapping(address => DIDDocument) public dids;

    // Emitted when a DID is registered
    event DIDRegistered(address indexed owner, string didDocument, uint256 timestamp);

    // Emitted when a credential pointer is updated
    event CredentialUpdated(address indexed owner, string credentialCID, uint256 timestamp);

    /**
     * @notice Register a new DID Document.
     * @param didDocument A JSON string containing your DID document.
     *
     * Requirements:
     * - The DID document cannot be empty.
     * - The sender must not have a pre-registered DID.
     */
    function registerDID(string calldata didDocument) external {
        require(bytes(didDocument).length > 0, "DID document is required");
        require(dids[msg.sender].owner == address(0), "DID already registered");

        dids[msg.sender] = DIDDocument({
            owner: msg.sender,
            doc: didDocument,
            credentialCID: "",
            timestamp: block.timestamp
        });

        emit DIDRegistered(msg.sender, didDocument, block.timestamp);
    }

    /**
     * @notice Update the credential pointer of your registered DID.
     * @param credentialCID The new credential pointer (e.g., an IPFS CID).
     *
     * Requirements:
     * - The sender must have already registered a DID.
     */
    function updateCredential(string calldata credentialCID) external {
        require(dids[msg.sender].owner != address(0), "DID not registered");

        dids[msg.sender].credentialCID = credentialCID;
        dids[msg.sender].timestamp = block.timestamp;

        emit CredentialUpdated(msg.sender, credentialCID, block.timestamp);
    }

    /**
     * @notice Retrieve a DID document by owner address.
     * @param owner The Ethereum address of the DID owner.
     * @return didDocument, credential pointer, and timestamp.
     */
    function getDID(address owner) external view returns (string memory, string memory, uint256) {
        DIDDocument memory didDoc = dids[owner];
        require(didDoc.owner != address(0), "DID not found");
        return (didDoc.doc, didDoc.credentialCID, didDoc.timestamp);
    }
}
