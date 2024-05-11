import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
// import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import '@openzeppelin/hardhat-upgrades';
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer"
//tasks
require('./tasks');

dotenv.config();

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ]
  },
  networks: {
    bscTestnet: {
      url: process.env.RPC_BSC_TESTNET,
      chainId: 97,
      gasPrice: 10000000000,
      gas: 15044139,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    bscmainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 3000000000,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    arbitrumSepolia: {
      url: process.env.RPC_ARBITRUM_SEP,
      chainId: 421614,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    optimisticSepolia: {
      url: process.env.RPC_OPTIMISM_SEP,
      gasPrice: 4000000,
      chainId: 11155420,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    sepolia: {
      url: process.env.RPC_SEPOLIA,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    polygonMumbai: {
      url: process.env.RPC_POLYGON_MUMBAI,
      gasPrice: 10000000000,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    polygon: {
      url: process.env.RPC_POLYGON,
      gasPrice: 3000000000000,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    morphTest: {
      url: 'https://rpc-testnet.morphl2.io' || '',
      gasPrice: 10000000000,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    taikoKatlaL2Test: {
      url: 'https://rpc.katla.taiko.xyz',
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    taikoHeklaTest: {
      url: 'https://rpc.hekla.taiko.xyz',
      gasPrice: 10000000000,
      accounts: {
        count: 12,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    hardhat: {
      // forking: {
      //   url: process.env.NODE_URI !== undefined ? process.env.NODE_URI : '',
      //   // blockNumber: 32910027
      // },
      accounts: {
        mnemonic,
        count: 100
      }
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  etherscan: {
    apiKey: {
      // ethereum mainnet
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      goerli: process.env.ETHERSCAN_API_KEY || '',
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      // binance smart chain
      bsc: process.env.BSCSCAN_API_KEY || '',
      bscTestnet: process.env.BSCSCAN_API_KEY || '',
      // polygon
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      // arbitrum
      arbitrumOne: process.env.ARBISCAN_API_KEY || '',
      arbitrumNova: process.env.ARBISCAN_API_KEY || '',
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || '',
      // avalanche
      avalanche: process.env.SNOWTRACE_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      // optimism
      optimisticEthereum: process.env.OPTIMISM_API_KEY || '',
      optimisticSepolia: process.env.OPTIMISM_API_KEY || '',
      // base
      base: process.env.BASESCAN_API_KEY || '',
      baseGoerli: process.env.BASESCAN_API_KEY || '',
      morphTest: "abc",
      // taiko katalka testnet
      taikoKatlaL2Test: "taiko_katla", // apiKey is not required, just set a placeholder
      // taikoHekla testnet
      taikoHeklaTest: "taiko_hekla", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
            apiURL: "https://api-sepolia.arbiscan.io/api",
            browserURL: "https://sepolia.arbiscan.io"
        }
      },
      {
        network: "optimisticSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io/",
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        }
      },
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org/",
        },
      },
      {
        network: "avalancheFujiTestnet",
        chainId: 43113,
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io/",
        },
      },
      {
        network: "avalanche",
        chainId: 43114,
        urls: {
          apiURL: "https://api.snowtrace.io/api",
          browserURL: "https://snowtrace.io/",
        },
      },
      {
        network: "morphTest",
        chainId: 2710,
        urls: {
          apiURL: "https://explorer-api-testnet.morphl2.io/api",
          browserURL: "https://explorer-testnet.morphl2.io",
        },
      },
      {
        network: "taikoKatlaL2Test",
        chainId: 167008,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/167008/etherscan",
          browserURL: "https://katla.taikoscan.network"
        }
      },
      {
        network: "taikoHeklaTest",
        chainId: 167009,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/167009/etherscan",
          browserURL: "https://hekla.taikoscan.network"
        }
      }
    ]
  }
};

export default config;
