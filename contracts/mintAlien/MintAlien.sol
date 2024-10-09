// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IAlien} from "../interface/IAlien.sol";

contract MintAlien is Ownable,ReentrancyGuard {

    using Strings for uint256;

    event AddedToWhitelist(address indexed account, uint256 level);
    event MintedAlien(address indexed account, uint256 level, uint256 tokenId);
    event LevelStatusChanged(uint8 level, bool status);
    event Level4CostSet(uint256 newCost);
    
    error BatchSizeExceeded();
    error AddressAlreadyWhitelisted(address account);
    //address is not on the waitlist
    error AddressNotWhitelisted(address sender);
    //Address has already minted
    error AddressAlreadyMinted();
    //Incorrect payment amount
    error IncorrectPaymentAmount();
    //All tokens minted
    error AllTokensMinted(uint8 level);
    //Exceeds whitelist limit
    error WhiteListLengthExceeded();
    //TokenUris Alien Divergent
    error TokenUrisLengthNotExpected();
    //Level not active
    error LevelNotActive(uint8 level);
    //Contracts not set
    error ContractNotSet();
    error InvalidAddress();

    //Address contract alienContract
    address public alienContract;
    //Address contract passportAddress
    address public passportAddress;
    //Address contract catalogAddress
    address public catalogAddress;
    // Cost to mint an NFT
    uint256 private constant LEVEL_1_COST = 0 ether;
    uint256 private constant LEVEL_2_COST = 12.30 ether;
    uint256 private constant LEVEL_3_COST = 0 ether;
    uint256 private  LEVEL_4_COST = 0 ether;
    // Maximum number of NFTs
    uint256 private constant MAX_SUPPLY_TOTAL = 10000;
    uint256 private constant MAX_SUPPLY_WAITLIST_1 = 214;
    uint256 private constant MAX_SUPPLY_WAITLIST_2 = 1782;
    uint256 private constant MAX_SUPPLY_PUBLIC_3 = 1004;
    //batch limit for adding addresses to wallet
    uint256 public constant BATCH_LIMIT = 300;
    // Mapping to check if an address has minted
    mapping(address => bool) private hasMinted;
    // Whitelist of addresses allowed to mint
    mapping(address => bool) private whitelistLevel1;
    // Whitelist of addresses allowed to mint
    mapping(address => bool) private whitelistLevel2;
    // Owner token URI Index
    mapping(address => uint256) private ownerTokenURIIndex;

    // Check the number of mints
    uint16 currentMintTotal;
    //Current mints
    uint16 currentMintWt1;
    uint16 currentMintWt2;
    uint16 currentMintPublic;

    //count how many wallets were added to the whitelist 1 and 2
    uint256 public whitelistCount1;
    uint256 public whitelistCount2;

    struct MintLevel { 
        bool Level1; 
        bool Level2; 
        bool Level3; 
        bool Level4; 
    }
    
    MintLevel public mintLevel;
    string private constant TOKENURI_BASE = "ipfs://QmSWgkGqps1TRuJCAc6QYoV2Jja6upBvxXQURSp2gQUyVv/mooner/";
    mapping(uint256 => uint256) private availableNumbers;
    //Mint more than one nft
    bool private unlimitedMint;

    constructor() Ownable(msg.sender) {
        mintLevel = MintLevel({
            Level1: false,
            Level2: false,
            Level3: false,
            Level4: false
        });
    }

    function setContractsAddress(
        address _alienContract,
        address _passportAddress,
        address _catalogAddress
    ) 
        external 
        onlyOwner 
    {
        if (_alienContract == address(0) || _passportAddress == address(0) || _catalogAddress == address(0)) {
            revert InvalidAddress();
        }
        alienContract = _alienContract;
        catalogAddress = _catalogAddress;
        passportAddress = _passportAddress;
        unlimitedMint = false;
    }

    function setLevelStatus(uint8 level, bool status) public onlyOwner {
        if (level < 1 || level > 4) revert("Invalid level");
        if (level == 1) mintLevel.Level1 = status;
        else if (level == 2) mintLevel.Level2 = status;
        else if (level == 3) mintLevel.Level3 = status;
        else if (level == 4) mintLevel.Level4 = status;
        emit LevelStatusChanged(level, status);
    }

    function getStatusLevel() external view returns (MintLevel memory) {
        return MintLevel({
            Level1:mintLevel.Level1 && currentMintWt1 < MAX_SUPPLY_WAITLIST_1,
            Level2:(mintLevel.Level2 && currentMintWt2 < MAX_SUPPLY_WAITLIST_2) || (currentMintWt1 >=  MAX_SUPPLY_WAITLIST_1  && currentMintWt2 < MAX_SUPPLY_WAITLIST_2),
            Level3:(mintLevel.Level3 && currentMintPublic < MAX_SUPPLY_PUBLIC_3) || (currentMintWt2 >= MAX_SUPPLY_WAITLIST_2 && currentMintPublic < MAX_SUPPLY_PUBLIC_3),
            Level4:mintLevel.Level4 && currentMintTotal < MAX_SUPPLY_TOTAL
        });
    }

    function whitelistCount() external view returns (uint256 wlCount1, uint256 wlCount2) {
        return (whitelistCount1, whitelistCount2);
    }

    function getCurrentMint() external view returns (
        uint16 currentMintWhitelist1,
        uint16 currentMintWhitelist2,
        uint16 currentMintPub,
        uint16 currentTotalMint
    ) {
        return (currentMintWt1, currentMintWt2, currentMintPublic, currentMintTotal);
    }

    function whitelistAllowedAddress(address owner) external view returns (bool whitelistAllowedLevel1, bool whitelistAllowedLevel2) {
        return (whitelistLevel1[owner], whitelistLevel2[owner]);
    }

    function mintsCost() external view returns (uint256 levelCost1, uint256 levelCost2, uint256 levelCost3, uint256 levelCost4) {
        return (LEVEL_1_COST, LEVEL_2_COST, LEVEL_3_COST, LEVEL_4_COST);
    }

    function maxSupply() external pure returns (
        uint256 maxSupplyWaitlist1,
        uint256 maxSupplyWaitlist2,
        uint256 maxSupplyPublic,
        uint256 maxSupplyTotal
    ) {
        return (MAX_SUPPLY_WAITLIST_1, MAX_SUPPLY_WAITLIST_2, MAX_SUPPLY_PUBLIC_3, MAX_SUPPLY_TOTAL);
    }

    function hasAlreadyMinted(address _owner) external view returns (bool minted, string memory tokenURI) {
        minted = hasMinted[_owner];
        tokenURI = '';

        if (minted) {
            uint256 indexTokenUri = ownerTokenURIIndex[_owner];
            tokenURI = IAlien(alienContract).tokenURI(indexTokenUri);
        }
       
        return (minted, tokenURI);
    }

    function getIndexTokenUriOwner(address _owner) external view returns (uint256 indexTokenUri) {
 
        indexTokenUri = ownerTokenURIIndex[_owner];
    }

    function hasMintedAlienNFT(address _owner) external view returns (uint16) {
        return hasMinted[_owner] ? 1 : 0;
    }

    function mintAlienLevel1(
    ) external payable {

        if (!mintLevel.Level1) revert LevelNotActive(1);
        if (!whitelistLevel1[msg.sender]) revert AddressNotWhitelisted(msg.sender);
        if (currentMintWt1 >= MAX_SUPPLY_WAITLIST_1) revert AllTokensMinted(1);
        if (msg.value != LEVEL_1_COST) revert IncorrectPaymentAmount();
        if (hasMinted[msg.sender]) revert AddressAlreadyMinted();
        
        uint256 tokenId = mintAlien(msg.sender);
        hasMinted[msg.sender] = true;
        currentMintWt1++;
        ownerTokenURIIndex[msg.sender] = tokenId;
        emit MintedAlien(msg.sender, 1, tokenId);

    }

    function mintAlienLevel2(
    ) external payable {

        if (!mintLevel.Level2 && currentMintWt1 < MAX_SUPPLY_WAITLIST_1) revert LevelNotActive(2);
        if (!whitelistLevel2[msg.sender]) revert AddressNotWhitelisted(msg.sender);
        if (currentMintWt2 >= MAX_SUPPLY_WAITLIST_2) revert AllTokensMinted(2);
        if (msg.value != LEVEL_2_COST) revert IncorrectPaymentAmount();
        if (hasMinted[msg.sender]) revert AddressAlreadyMinted();

        uint256 tokenId = mintAlien(msg.sender);

        hasMinted[msg.sender] = true;
        currentMintWt2++;
        ownerTokenURIIndex[msg.sender] = tokenId;
        emit MintedAlien(msg.sender, 2, tokenId);
    }

    function mintAlienLevel3(
    ) external payable {

        if (!mintLevel.Level3 && currentMintWt2 < MAX_SUPPLY_WAITLIST_2) revert LevelNotActive(3);
        if (currentMintPublic >= MAX_SUPPLY_PUBLIC_3) revert AllTokensMinted(3);
        if (msg.value != LEVEL_3_COST) revert IncorrectPaymentAmount();
        if (hasMinted[msg.sender]) revert AddressAlreadyMinted();
       
        uint256 tokenId = mintAlien(msg.sender);
        hasMinted[msg.sender] = true;
        currentMintPublic++;
        ownerTokenURIIndex[msg.sender] = tokenId;
        emit MintedAlien(msg.sender, 3, tokenId);

    }

    function mintAlienLevel4(
    ) external payable {

        if (!mintLevel.Level4) revert LevelNotActive(4);
        if (msg.value != LEVEL_4_COST) revert IncorrectPaymentAmount();
        if(!unlimitedMint){
            if (hasMinted[msg.sender]) revert AddressAlreadyMinted();
        }
       
        uint256 tokenId = mintAlien(msg.sender);
        hasMinted[msg.sender] = true;
        emit MintedAlien(msg.sender, 4, tokenId);

    }

    function mintAlien(
        address to
    ) private returns (uint256) {

        if (alienContract == address(0) || passportAddress == address(0) || catalogAddress == address(0)) {
            revert ContractNotSet();
        }
        
        if (currentMintTotal >= MAX_SUPPLY_TOTAL) revert AllTokensMinted(0);

        string memory tokenURI = getRandomTokenURI();
        uint64[] memory partsIds;

        uint256 indexTokenAlien = IAlien(alienContract).mintWithAssets(
            to,
            tokenURI,
            300001,
            catalogAddress,
            partsIds
        );

        currentMintTotal++;

        return indexTokenAlien;
    }

    function mintAlienOwner(
        address to
    ) external onlyOwner {
       
        uint256 tokenId = mintAlien(to);
        emit MintedAlien(to, 0, tokenId);
    }

    // --

    function generateUniqueRandomNumber() private returns (uint256) {
        require(currentMintTotal < MAX_SUPPLY_TOTAL, "All numbers have been generated");
        
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, currentMintTotal))) % (MAX_SUPPLY_TOTAL - currentMintTotal);
        uint256 result = availableNumbers[randomNumber] != 0 ? availableNumbers[randomNumber] : randomNumber + 1;
        
        if (randomNumber != MAX_SUPPLY_TOTAL - currentMintTotal - 1) {
            uint256 lastAvailable = availableNumbers[MAX_SUPPLY_TOTAL - currentMintTotal - 1] != 0 
                ? availableNumbers[MAX_SUPPLY_TOTAL - currentMintTotal - 1] 
                : MAX_SUPPLY_TOTAL - currentMintTotal;
            availableNumbers[randomNumber] = lastAvailable;
        }
        
        return result;
    }

    function getRandomTokenURI() public returns (string memory) {
        uint256 randomNumber = generateUniqueRandomNumber();
        string memory ramdonTokenUri = string(abi.encodePacked(TOKENURI_BASE, randomNumber.toString(), ".json"));
        
        return ramdonTokenUri;
    }
    
    // --

    /**
     * @dev Adds addresses to the whitelist. Only the owner can call this function.
     * @param addresses Array of addresses to be added to the whitelist.
     */
    function addToWhitelist1(address[] calldata addresses) external onlyOwner {
        if(whitelistCount1 + addresses.length > MAX_SUPPLY_WAITLIST_1) revert WhiteListLengthExceeded();
        if(addresses.length > BATCH_LIMIT) revert BatchSizeExceeded();
        
        uint256 addedCount = 0;
        for (uint256 i = 0; i < addresses.length; i++) {

            if (whitelistLevel1[addresses[i]]) {
                revert AddressAlreadyWhitelisted(addresses[i]);
            }

            whitelistLevel1[addresses[i]] = true;
            emit AddedToWhitelist(addresses[i], 1);

            addedCount++;
        }

        whitelistCount1 += addedCount;
    }

    function addToWhitelist2(address[] calldata addresses) external onlyOwner {
        if(whitelistCount2 + addresses.length > MAX_SUPPLY_WAITLIST_2) revert WhiteListLengthExceeded();
        if(addresses.length > BATCH_LIMIT) revert BatchSizeExceeded();

        uint256 addedCount = 0;
        for (uint256 i = 0; i < addresses.length; i++) {
            if (whitelistLevel2[addresses[i]]) {
                revert AddressAlreadyWhitelisted(addresses[i]);
            }

            whitelistLevel2[addresses[i]] = true;
            emit AddedToWhitelist(addresses[i], 2);

            addedCount++;
        }

        whitelistCount2 += addedCount;
    }

    function setCostLevel4(uint256 _cost) external onlyOwner {
        LEVEL_4_COST =  _cost;
    }

    function setUlimitedMint(bool _unlimitedMint) external onlyOwner {
        unlimitedMint = _unlimitedMint;
    }

    function withdraw() external onlyOwner nonReentrant{
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "Contract balance is zero");

        address payable recipient = payable(owner());

        // Using call method to transfer Ether and handle potential errors
        (bool success, ) = recipient.call{value: contractBalance}("");
        require(success, "Transfer failed");
    }

}
