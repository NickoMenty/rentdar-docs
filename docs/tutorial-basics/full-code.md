---
sidebar_position: 3
title: Solidity code
---
The full code for the solidity contract can be found here: 

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomUriNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    uint256 private _tokenCounter;
    string public _tokenURI;
    mapping(uint256 => uint256) private _mintFees; // Mapping to store mint fees for each token
    mapping(uint256 => address) private _withdrawAddresses; // Mapping to store withdrawal addresses for each token

    event NftMinted(
        uint256 tokenId,
        address recipient,
        string tokenURI,
        uint256 mintFee,
        address withdrawAddress
    );

    constructor() ERC721("CustomUriNFT", "CUNFT") {
        _tokenCounter = 0;
    }

    function mintNft(
        string memory tokenURI,
        uint256 mintFee,
        address withdrawAddress,
        address recipient
    ) public payable {
        require(msg.value >= mintFee, "Not enough ETH sent");

        _tokenCounter++;
        uint256 newItemId = _tokenCounter;
        _safeMint(recipient, newItemId); // Mint the NFT to the recipient
        _setTokenURI(newItemId, tokenURI);

        // Store mint fee and withdraw address
        _mintFees[newItemId] = mintFee;
        _withdrawAddresses[newItemId] = withdrawAddress;

        emit NftMinted(newItemId, recipient, tokenURI, mintFee, withdrawAddress);
    }

    function withdraw(uint256 tokenId) public {
        address withdrawAddress = _withdrawAddresses[tokenId];
        require(withdrawAddress == msg.sender, "Not authorized to withdraw");
        uint256 amount = address(this).balance;
        _mintFees[tokenId] = 0; // Prevent re-entrancy
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function withdrawAnyAmount(address to, uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenCounter;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function getBalance(address account) public view returns (uint256) {
        return account.balance;
    }
}
```