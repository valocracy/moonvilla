// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {RMRKEquippablePreMintSoulbound} from "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKEquippablePreMintSoulbound.sol";
import {RMRKAbstractEquippable} from "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";
import {RMRKSoulbound} from "@rmrk-team/evm-contracts/contracts/RMRK/extension/soulbound/RMRKSoulbound.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import  "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Passport is RMRKEquippablePreMintSoulbound {

    using MessageHashUtils for bytes32;
    using ECDSA for bytes32;

    event MintPassport(address indexed to, uint256 indexed tokenId);

    mapping(address => bool) private _autoAcceptCollection;
    mapping(address => uint256) private ownerPassportId;

    address catalogAddress;

    // Constructor
    constructor(
        string memory collectionMetadata,
        uint256 maxSupply,
        uint16 royaltyPercentageBps,
        address _catalogAddress
    )
        RMRKEquippablePreMintSoulbound(
            "Passport",
            "PASS",
            collectionMetadata,
            maxSupply,
            msg.sender,
            royaltyPercentageBps
        )
    {
        catalogAddress = _catalogAddress;
    }
      
    // Methods
    function mintWithEquippableAsset(
        string memory tokenURI,
        uint64 slotFixed,
        bytes memory signature
    ) public {

        uint64[] memory partIds = new uint64[](2);
        partIds[0] = slotFixed;
        partIds[1] = 300001;
        
        bytes32 messageHash = keccak256(abi.encodePacked(tokenURI,slotFixed,msg.sender));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(signature);

        require(recoveredSigner == owner(), "Invalid signature");

        uint256 tokenId = mint(msg.sender, 1, tokenURI);
        uint256 assetId = setEquippableAssetEntry(300001, catalogAddress, tokenURI,partIds);
        setAssetToToken(tokenId, uint64(assetId), 0);
        
        ownerPassportId[msg.sender] = tokenId;

        emit MintPassport(msg.sender,tokenId);
    }

    function mint(
        address to,
        uint256 numToMint,
        string memory tokenURI
    ) override public virtual returns (uint256 firstTokenId) {
        
        //require(balanceOf(to) == 0,"Address already has a passport");
        
        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(
            numToMint
        );

        for (uint256 i = nextToken; i < totalSupplyOffset; ) {
            _setTokenURI(i, tokenURI);
            _safeMint(to, i, "");
            unchecked {
                ++i;
            }
        }

        firstTokenId = nextToken;
    }
    
    function setEquippableAssetEntry(
        uint64 equippableGroupId,
        address catalogAdd,
        string memory metadataURI,
        uint64[] memory partIds
    ) private returns (uint256 assetId) {
        unchecked {
            ++_totalAssets;
        }
        _addAssetEntry(
            uint64(_totalAssets),
            equippableGroupId,
            catalogAdd,
            metadataURI,
            partIds
        );
        assetId = _totalAssets;
    }

    function setAssetToToken(
        uint256 tokenId,
        uint64 assetId,
        uint64 replacesAssetWithId
    ) private {
        _addAssetToToken(tokenId, assetId, replacesAssetWithId);
    }

    function checkAlienEquippedPassport(
        address owner
    ) external view returns (uint16){
        
        uint256 tokenId = getOwnerTokenId(owner);
        Equipment memory alienEquip = getEquipment(tokenId,catalogAddress,300001);

        return alienEquip.assetId != 0 ? 1 : 0;
    }

    function getOwnerTokenId(address owner) public view returns(uint256 tokenId) {
        tokenId = ownerPassportId[owner];
    }

    /**
       * @inheritdoc IERC165
       */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
      
        override(RMRKEquippablePreMintSoulbound)
        returns (bool){
        return 
            RMRKAbstractEquippable.supportsInterface(interfaceId) ||
            RMRKSoulbound.supportsInterface(interfaceId);
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(RMRKEquippablePreMintSoulbound) {
        RMRKSoulbound._beforeTokenTransfer(from, to, tokenId);
        RMRKEquippablePreMintSoulbound._beforeTokenTransfer(from, to, tokenId);
    }
      
    function setAutoAcceptCollection(
        address collection,
        bool autoAccept
    ) public virtual onlyOwnerOrContributor {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(
        uint256 tokenId,
        address childAddress,
        uint256 childId,
        bytes memory
    ) internal virtual override {
        // Auto accept children if they are from known collections
        if (_autoAcceptCollection[childAddress]) {
            _acceptChild(
                tokenId,
                _pendingChildren[tokenId].length - 1,
                childAddress,
                childId
            );
        }
    }
}



  