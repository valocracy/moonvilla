// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;

import {RMRKEquippablePreMint} from "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKEquippablePreMint.sol";
import {RMRKAbstractEquippable} from "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";
import {IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IPassport} from "./interface/IPassport.sol";

error ERC721OutOfBoundsIndex(address owner, uint256 index);

contract Alien is RMRKEquippablePreMint{
    
    // Events 
    // Variables
    // IERC721Enumerable
    mapping(address owner => mapping(uint256 index => uint256))private _ownedTokens;
    mapping(uint256 tokenId => uint256) private _ownedTokensIndex;
    
    uint256[] private _allTokens;
    mapping(uint256 tokenId => uint256) private _allTokensIndex;

    address passport;

    // Constructor
    constructor(
        string memory collectionMetadata,
        uint256 maxSupply,
        uint16 royaltyPercentageBps,
        address passportAddress
    )
        RMRKEquippablePreMint(
            "Mooner",
            "MOONER",
            collectionMetadata,
            maxSupply,
            msg.sender,
            royaltyPercentageBps
        )
    {
        passport = passportAddress;
    }
      
    // Methods

    function nestMintWithAssets(
        address to,
        uint256 destinationId,
        string memory tokenURI,
        uint64[] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        uint256 tokenId = nestMint(to, 1, destinationId, tokenURI);
        uint256 length = assetIds.length;
        for (uint256 i = 0; i < length; i++) {
            addAssetToToken(tokenId, assetIds[i], 0);

            if (_pendingAssets[tokenId].length != 0) {
                _acceptAsset(tokenId, 0 , assetIds[i]);
            }
        }
    }

    function mintWithAssets(
        address to,
        string memory tokenURI,
        uint64 equippableGroupId,
        address catalogAddress,
        uint64[] memory partIds
    ) public virtual onlyOwnerOrContributor returns(uint256){
        
        uint256 assetId = addEquippableAssetEntry(equippableGroupId,catalogAddress,tokenURI,partIds);

        uint256 tokenId = mint(to, 1, tokenURI);
       
        addAssetToToken(tokenId, uint64(assetId), 0);
        
        if (_pendingAssets[tokenId].length != 0) {
            _acceptAsset(tokenId, 0 , uint64(assetId));
        }
        
        return tokenId;
    }

    function checkHasAlien(address owner) external view returns(uint16){

        if(balanceOf(owner) > 0) return 1;

        IPassport iPassport = IPassport(passport);
        uint256 tokenId = iPassport.getOwnerTokenId(owner);
        Child[] memory child = iPassport.childrenOf(tokenId);
  
        uint256 length = child.length > 100 ? 100 : child.length;
        for (uint256 i = 0; i < length; i++) {
            
            if(child[i].tokenId != 0 && child[i].contractAddress == address(this)) return 1;
        }

        return 0;
    }

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) public view virtual returns (uint256) {
       
        if (index >= balanceOf(owner)) {
            revert ERC721OutOfBoundsIndex(owner, index);
        }
        return _ownedTokens[owner][index];
    }


    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view virtual returns (uint256) {
        if (index >= totalSupply()) {
            revert ERC721OutOfBoundsIndex(address(0), index);
        }
        return _allTokens[index];
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(
        address from,
        uint256 tokenId
    ) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allTokensIndex[tokenId];
        _allTokens.pop();
    }
    

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override
        returns (bool)
    {
        return 
            type(IERC721Enumerable).interfaceId == interfaceId ||
            RMRKAbstractEquippable.supportsInterface(interfaceId);
    }
      
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }
    
}
  