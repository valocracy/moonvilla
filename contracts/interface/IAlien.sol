// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAlien {

    function mintWithAssets(
        address to,
        string memory tokenURI,
        uint64 equippableGroupId,
        address catalogAddress,
        uint64[] memory partIds
    ) external returns(uint256);
    
    function tokenURI(
        uint256 tokenId
    ) external view  returns (string memory tokenURI_);
}