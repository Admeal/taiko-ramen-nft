// SPDX-License-Identifier: MIT
//
//   /$$$$$$$$           /$$ /$$                 /$$$$$$$                                             
//  |__  $$__/          |__/| $$                | $$__  $$                                            
//     | $$     /$$$$$$  /$$| $$   /$$  /$$$$$$ | $$  \ $$  /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$ 
//     | $$    |____  $$| $$| $$  /$$/ /$$__  $$| $$$$$$$/ |____  $$| $$_  $$_  $$ /$$__  $$| $$__  $$
//     | $$     /$$$$$$$| $$| $$$$$$/ | $$  \ $$| $$__  $$  /$$$$$$$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$
//     | $$    /$$__  $$| $$| $$_  $$ | $$  | $$| $$  \ $$ /$$__  $$| $$ | $$ | $$| $$_____/| $$  | $$
//     | $$   |  $$$$$$$| $$| $$ \  $$|  $$$$$$/| $$  | $$|  $$$$$$$| $$ | $$ | $$|  $$$$$$$| $$  | $$
//     |__/    \_______/|__/|__/  \__/ \______/ |__/  |__/ \_______/|__/ |__/ |__/ \_______/|__/  |__/
//                                                                                                    
//  
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// @title TaikoRamen
contract TaikoRamen is ERC1155URIStorage, Ownable {
    // @notice Amount of token types
    uint256 public tokenTypesAmount;
    
    // @notice Token type structure
    struct TokenType {
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 pricePerCopy;
    }

    // @notice Token types
    mapping (uint256 => TokenType) public tokenTypes;

    // @notice Event emitted when a new token type is created
    event TokenTypeCreated(uint256 indexed tokenType, uint256 maxSupply, uint256 pricePerCopy, string uri);
    // @notice Event emitted when a token type is updated
    event TokenTypeUpdated(uint256 indexed tokenType, uint256 maxSupply, uint256 pricePerCopy, string uri);
    // @notice Event emitted when a new token is minted
    event Minted(uint256 indexed tokenType, address indexed owner);

    // @notice Constructor
    // @param _maxSupply Maximum supply of the token type
    // @param _pricePerCopy Price per copy of the token type
    // @param _uri URI of the token type
    constructor(
        uint256 _maxSupply,
        uint256 _pricePerCopy,
        string memory _uri
    ) ERC1155("") {
        // initial token type
        createNewTokenType(_maxSupply, _pricePerCopy, _uri);
    }

    // @notice Create a new token type
    // @dev Only owner can call this function
    // @param _maxSupply Maximum supply of the token type
    // @param _pricePerCopy Price per copy of the token type
    // @param _uri URI of the token type
    function createNewTokenType(
        uint256 _maxSupply,
        uint256 _pricePerCopy,
        string memory _uri
    ) public onlyOwner {
        tokenTypes[tokenTypesAmount] = TokenType(_maxSupply, 0, _pricePerCopy);
        _setURI(tokenTypesAmount, _uri);
        tokenTypesAmount++;

        emit TokenTypeCreated(tokenTypesAmount - 1, _maxSupply, _pricePerCopy, _uri);
    }

    // @notice Update token type
    // @dev Only owner can call this function
    // @param _tokenType Token type to update
    // @param _maxSupply Maximum supply of the token type
    // @param _pricePerCopy Price per copy of the token type
    // @param _uri URI of the token type
    function updateTokenType(
        uint256 _tokenType,
        uint256 _maxSupply,
        uint256 _pricePerCopy,
        string memory _uri
    ) external onlyOwner {
        require(_tokenType < tokenTypesAmount, "TaikoRamen: Token type does not exist");
        tokenTypes[_tokenType] = TokenType(_maxSupply, tokenTypes[_tokenType].currentSupply, _pricePerCopy);
        _setURI(_tokenType, _uri);

        emit TokenTypeUpdated(_tokenType, _maxSupply, _pricePerCopy, _uri);
    }

    // @notice Mint a new token
    // @param _tokenType Token type to mint
    function mint(uint256 _tokenType) public payable {
        TokenType storage tokenType = tokenTypes[_tokenType];
        require(tokenType.maxSupply > tokenType.currentSupply, "TaikoRamen: All token copies have been minted");
        require(msg.value >= tokenType.pricePerCopy, "TaikoRamen: Insufficient payment");
        require(balanceOf(msg.sender,_tokenType) == 0, "TaikoRamen: You cannot mint more than one copy of the same token type");

        tokenType.currentSupply++;
        _mint(msg.sender, _tokenType, 1, "");

        if(msg.value > tokenType.pricePerCopy) {
            // return change
            payable(msg.sender).transfer(msg.value - tokenType.pricePerCopy);
        }

        emit Minted(_tokenType, msg.sender);
    }

    // @notice Withdraw contract balance
    // @dev Only owner can call this function
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // @notice Receive function
    // @dev Buy latest token type
    receive() external payable {
        // buy latest token type
        mint(tokenTypesAmount - 1);
    }
}