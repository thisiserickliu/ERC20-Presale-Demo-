// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Presale is ReentrancyGuard, Ownable {
    // using SafeMath for uint256; // 移除

    IERC20 public token;
    IERC20 public paymentToken; // USDT, USDC, etc.
    
    uint256 public tokenPrice; // Price per token in payment token (with decimals)
    uint256 public minPurchase;
    uint256 public maxPurchase;
    uint256 public presaleStart;
    uint256 public presaleEnd;
    uint256 public totalTokensForSale;
    uint256 public tokensSold;
    uint256 public totalRaised;
    
    bool public presaleFinalized;
    
    mapping(address => uint256) public userPurchases;
    mapping(address => bool) public whitelist;
    bool public whitelistEnabled;
    
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event PresaleFinalized(uint256 totalSold, uint256 totalRaised);
    event WhitelistUpdated(address indexed user, bool status);
    
    constructor(
        address _token,
        address _paymentToken,
        uint256 _tokenPrice,
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _totalTokensForSale,
        uint256 _presaleStart,
        uint256 _presaleEnd
    ) {
        require(_token != address(0), "Invalid token address");
        require(_paymentToken != address(0), "Invalid payment token address");
        require(_tokenPrice > 0, "Token price must be greater than 0");
        require(_presaleEnd > _presaleStart, "Invalid presale period");
        require(_totalTokensForSale > 0, "Total tokens for sale must be greater than 0");
        
        token = IERC20(_token);
        paymentToken = IERC20(_paymentToken);
        tokenPrice = _tokenPrice;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        totalTokensForSale = _totalTokensForSale;
        presaleStart = _presaleStart;
        presaleEnd = _presaleEnd;
    }
    
    modifier presaleActive() {
        require(block.timestamp >= presaleStart, "Presale has not started");
        require(block.timestamp <= presaleEnd, "Presale has ended");
        require(!presaleFinalized, "Presale is finalized");
        _;
    }
    
    modifier whitelistCheck() {
        if (whitelistEnabled) {
            require(whitelist[msg.sender], "Address not whitelisted");
        }
        _;
    }
    
    function buyTokens(uint256 amount) external presaleActive whitelistCheck nonReentrant {
        require(amount >= minPurchase, "Amount below minimum purchase");
        require(amount <= maxPurchase, "Amount exceeds maximum purchase");
        require(userPurchases[msg.sender] + amount <= maxPurchase, "Exceeds personal maximum");
        require(tokensSold + amount <= totalTokensForSale, "Not enough tokens available");
        
        uint256 cost = amount * tokenPrice / 1e18;
        
        require(paymentToken.transferFrom(msg.sender, address(this), cost), "Payment transfer failed");
        
        userPurchases[msg.sender] = userPurchases[msg.sender] + amount;
        tokensSold = tokensSold + amount;
        totalRaised = totalRaised + cost;
        
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        
        emit TokensPurchased(msg.sender, amount, cost);
    }
    
    function finalizePresale() external onlyOwner {
        require(block.timestamp > presaleEnd || tokensSold >= totalTokensForSale, "Presale still active");
        require(!presaleFinalized, "Presale already finalized");
        
        presaleFinalized = true;
        
        // Transfer unsold tokens back to owner
        uint256 unsoldTokens = totalTokensForSale - tokensSold;
        if (unsoldTokens > 0) {
            require(token.transfer(owner(), unsoldTokens), "Failed to transfer unsold tokens");
        }
        
        emit PresaleFinalized(tokensSold, totalRaised);
    }
    
    function withdrawFunds() external onlyOwner {
        require(presaleFinalized, "Presale not finalized");
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        require(paymentToken.transfer(owner(), balance), "Failed to transfer funds");
    }
    
    function setWhitelist(address[] calldata users, bool[] calldata statuses) external onlyOwner {
        require(users.length == statuses.length, "Arrays length mismatch");
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = statuses[i];
            emit WhitelistUpdated(users[i], statuses[i]);
        }
    }
    
    function setWhitelistEnabled(bool enabled) external onlyOwner {
        whitelistEnabled = enabled;
    }
    
    function updatePresalePeriod(uint256 _start, uint256 _end) external onlyOwner {
        require(_end > _start, "Invalid presale period");
        presaleStart = _start;
        presaleEnd = _end;
    }

    function startPresale(uint256 _start, uint256 _end) external onlyOwner {
        require(_end > _start, "Invalid presale period");
        require(block.timestamp < _start, "Start time must be in the future");
        require(!presaleFinalized, "Presale already finalized");
        presaleStart = _start;
        presaleEnd = _end;
    }
    
    function updateTokenPrice(uint256 _price) external onlyOwner {
        require(_price > 0, "Token price must be greater than 0");
        tokenPrice = _price;
    }
    
    function getPresaleInfo() external view returns (
        uint256 _tokenPrice,
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _totalTokensForSale,
        uint256 _tokensSold,
        uint256 _totalRaised,
        uint256 _presaleStart,
        uint256 _presaleEnd,
        bool _presaleFinalized,
        bool _whitelistEnabled
    ) {
        return (
            tokenPrice,
            minPurchase,
            maxPurchase,
            totalTokensForSale,
            tokensSold,
            totalRaised,
            presaleStart,
            presaleEnd,
            presaleFinalized,
            whitelistEnabled
        );
    }
    
    function getUserInfo(address user) external view returns (
        uint256 _purchased,
        bool _whitelisted
    ) {
        return (
            userPurchases[user],
            whitelist[user]
        );
    }

    function applyWhitelist() external {
        require(!whitelist[msg.sender], "Already whitelisted");
        whitelist[msg.sender] = true;
        emit WhitelistUpdated(msg.sender, true);
    }
} 