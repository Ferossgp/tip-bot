// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Tips {
    using SafeERC20 for IERC20;
    mapping(address => mapping(address => uint256)) private _balances;

    constructor() {}

    function deposit(uint256 amount, address token) public {
        require(amount > 0, "Denomination should be greater than 0");

        uint256 allowance = IERC20(token).allowance(msg.sender, address(this));
        require(allowance >= amount, "Allowance is not enough");

        // IERC20(token).approve(msg.sender, amount);

        // Transfer tokens from the sender to this contract
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // Update the balance in the mapping
        _balances[token][msg.sender] += amount;
    }

    // Function to get the balance of tokens for a particular user
    function balanceOf(
        address token,
        address account
    ) public view returns (uint256) {
        return _balances[token][account];
    }

    function balanceOfContract(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // Function to claim tokens from another address
    function claimTokens(address token, uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");

        // Check the balance of the contract
        uint256 contractBalance = IERC20(token).balanceOf(address(this));
        require(contractBalance >= amount, "Contract's balance is not enough");

        //approve the contract to spend the tokens
        // IERC20(token).approve(address(this), amount);

        // Transfer tokens from the sender to this contract
        IERC20(token).transfer(msg.sender, amount);

        // Update the balances in the mapping
        // _balances[token][msg.sender] -= amount;
    }
}
