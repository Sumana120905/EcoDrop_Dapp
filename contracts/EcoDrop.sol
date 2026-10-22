
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EcoDrop {
    address public owner;
    uint256 public totalRecords;

    enum Status {
        Registered,
        Collected
    }

    struct WasteRecord {
        uint256 id;
        address registrant;
        string category;
        string description;
        uint256 timestamp;
        Status status;
    }

    mapping(uint256 => WasteRecord) private records;
    mapping(address => bool) public authorisedVerifiers;

    event WasteRegistered(
        uint256 indexed id,
        address indexed registrant,
        string category
    );

    event VerifierAuthorised(address indexed verifier);

    event CollectionConfirmed(
        uint256 indexed id,
        address indexed verifier
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(
            authorisedVerifiers[msg.sender],
            "Caller is not an authorised verifier"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        totalRecords = 0;
    }

    function registerWaste(
        string calldata category,
        string calldata description
    ) external {
        require(bytes(category).length > 0, "Category cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        totalRecords++;

        records[totalRecords] = WasteRecord({
            id: totalRecords,
            registrant: msg.sender,
            category: category,
            description: description,
            timestamp: block.timestamp,
            status: Status.Registered
        });

        emit WasteRegistered(totalRecords, msg.sender, category);
    }

    function verifyRecycler(address verifier) external onlyOwner {
        require(verifier != address(0), "Invalid verifier address");
        require(!authorisedVerifiers[verifier], "Already authorised");

        authorisedVerifiers[verifier] = true;

        emit VerifierAuthorised(verifier);
    }

    function confirmCollection(uint256 id) external onlyVerifier {
        require(id > 0 && id <= totalRecords, "Record does not exist");
        require(
            records[id].status == Status.Registered,
            "Waste already collected"
        );

        records[id].status = Status.Collected;

        emit CollectionConfirmed(id, msg.sender);
    }

    function getWaste(
        uint256 id
    ) external view returns (WasteRecord memory) {
        require(id > 0 && id <= totalRecords, "Record does not exist");
        return records[id];
    }

    function getTotalRecords() external view returns (uint256) {
        return totalRecords;
    }

    function getAllRecords()
        external
        view
        returns (WasteRecord[] memory)
    {
        WasteRecord[] memory result = new WasteRecord[](totalRecords);

        for (uint256 i = 1; i <= totalRecords; i++) {
            result[i - 1] = records[i];
        }

        return result;
    }
}
