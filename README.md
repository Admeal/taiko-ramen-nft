# TaikoRamen NFT token

TaikoRamen is an ERC1155 token contract that enables the creation and management of non-fungible tokens (NFTs) representing various types of digital assets related to the TaikoRamen project.

Address in the Taiko Hekla L2 Testnet:

`0x24097eE390D537E94A3Fc6E8e367FF765513BE07`

## Overview

The TaikoRamen contract utilizes the ERC1155 standard, which allows for the creation of multiple token types within a single contract, each with its own unique properties. This flexibility enables efficient management and transfer of different types of NFTs, making it suitable for various applications such as gaming, digital collectibles, and more.

## Features

### Multiple Token Types

TaikoRamen supports the creation of multiple token types, each defined by its maximum supply, current supply, price per copy, and URI.

### Minting

Users can mint new tokens by providing the token type they wish to mint. Minting requires payment based on the specified price per copy for the token type.

### Token Type Management

The contract owner has the ability to create new token types, update existing token types, and manage the URI associated with each token type.

### Withdrawal

The contract owner can withdraw the contract's balance, enabling easy access to funds accumulated from token sales.


## Installation

```shell
npm i
```

## Task

- Mint:

    ```shell
    npx hardhat mint --network taikoHeklaTest --token-type 0
    ```

## Test

```shell
npx hardhat test
```

## Verification

- Verify programmatically (does not adapted for Taiko Katal)

    ```shell
    npx hardhat run scripts/verifyToken.ts --network taikoHeklaTest
    ```

- Verify through blockscoutapi

    Generate Flattened version of the contract 

    ```shell
    npx hardhat flatten contracts/TaikoRamen.sol > FlattenedTaikoRamen.sol
    ```

    Verify manually through `https://blockscoutapi.hekla.taiko.xyz/address/{CONTRACT_ADDRESS}`