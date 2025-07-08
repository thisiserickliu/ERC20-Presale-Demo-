// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant TOTAL_SUPPLY = 100_000_000 * 1e18;
    uint256 public constant INITIAL_CIRCULATING = 40_000_000 * 1e18;

    // Tax rates (in percent)
    uint256 public constant TAX_TOTAL = 5;
    uint256 public constant TAX_REFLECTION = 2;
    uint256 public constant TAX_LIQUIDITY = 2;
    uint256 public constant TAX_BURN = 1;

    // Accumulators for liquidity and reflection
    uint256 public accumulatedLiquidity;
    uint256 public accumulatedReflection;

    mapping(address => bool) public isTaxExempt;

    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, INITIAL_CIRCULATING);
        _mint(address(this), TOTAL_SUPPLY - INITIAL_CIRCULATING); // The rest for allocation/vesting
        isTaxExempt[msg.sender] = true; // Owner is tax-exempt
        isTaxExempt[address(this)] = true;
    }

    function setTaxExempt(address account, bool exempt) external onlyOwner {
        isTaxExempt[account] = exempt;
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        if (isTaxExempt[from] || isTaxExempt[to]) {
            super._transfer(from, to, amount);
            return;
        }
        // Calculate tax
        uint256 taxAmount = amount * TAX_TOTAL / 100;
        uint256 reflectionAmount = amount * TAX_REFLECTION / 100;
        uint256 liquidityAmount = amount * TAX_LIQUIDITY / 100;
        uint256 burnAmount = amount * TAX_BURN / 100;
        uint256 sendAmount = amount - taxAmount;

        // Reflection: accumulate for later distribution (simplified)
        accumulatedReflection += reflectionAmount;
        // Liquidity: accumulate for later use
        accumulatedLiquidity += liquidityAmount;
        // Burn: directly burn
        _burn(from, burnAmount);

        // Transfer the rest to recipient
        super._transfer(from, to, sendAmount);
        // Optionally, send liquidity/reflection to owner for demo
        super._transfer(from, owner(), reflectionAmount + liquidityAmount);
    }

    // Owner can withdraw tokens from contract (for allocation/vesting)
    function withdrawForAllocation(address to, uint256 amount) external onlyOwner {
        _transfer(address(this), to, amount);
    }
} 