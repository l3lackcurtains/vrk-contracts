// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Swap {
    // Using safe math
    using SafeMath for uint256;

    // Token instanceof
    IERC20 public token;

    // Exchange rate
    uint256 public exchangeRate = 500;

    // Contract owner
    address public owner;

    // Owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }

    // Swap Events
    event EthToToken(
        address indexed user,
        address token,
        uint256 amount,
        uint256 exchangeRate
    );
    event TokenToEth(
        address indexed user,
        address token,
        uint256 amount,
        uint256 exchangeRate
    );

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
        owner = msg.sender;
    }

    function changeExchangeRate(uint256 _rate) external onlyOwner {
        exchangeRate = _rate;
    }

    function swapEthToToken() public payable {
        uint256 tokenValue = msg.value.mul(exchangeRate);

        // Check token balance of contract
        require(token.balanceOf(address(this)) >= tokenValue, "Low Balance");

        // Transfer token to user
        token.transfer(msg.sender, tokenValue);

        emit EthToToken(msg.sender, address(token), tokenValue, exchangeRate);
    }

    function swapTokenToEth(uint256 _value) public {
        uint256 ethValue = _value.div(exchangeRate);
        // Check allowance and balance
        require(
            token.allowance(msg.sender, address(this)) >= _value,
            "No allowance"
        );
        require(
            token.balanceOf(address(msg.sender)) >= _value,
            "Low balance of sender"
        );
        require(address(this).balance >= ethValue, "Low balance of provider");

        // Receive token from user
        token.transferFrom(msg.sender, address(this), _value);

        // Transfer ETH to user
        payable(msg.sender).transfer(ethValue);

        emit TokenToEth(msg.sender, address(token), _value, exchangeRate);
    }
}
