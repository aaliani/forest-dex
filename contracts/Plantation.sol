pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract Plantation is ERC20("Plantation", "xFOREST"){
    using SafeMath for uint256;
    IERC20 public forest;

    constructor(IERC20 _forest) public {
        forest = _forest;
    }

    // Enter the bar. Pay some SUSHIs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalForest = forest.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalForest == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalForest);
            _mint(msg.sender, what);
        }
        forest.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SUSHIs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(forest.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        forest.transfer(msg.sender, what);
    }
}