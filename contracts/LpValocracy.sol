// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LpValocracy is ERC20, ERC20Permit, Ownable {

    constructor(uint256 amount)
        ERC20("LpValocracy", "LPVAL")
        ERC20Permit("LpValocracy")
        Ownable(msg.sender)
    {
        mint(msg.sender, amount);
    }

    function mint(address account,uint256 _amount) public onlyOwner{

        _mint(account, _amount * 10 ** decimals());

    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

}