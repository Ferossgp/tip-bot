import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { join } from "path";
import dotenv from "dotenv";
import path from "path";
import "@nomicfoundation/hardhat-ignition";
import "@matterlabs/hardhat-zksync";

dotenv.config(); // project root
dotenv.config({ path: join(process.cwd(), "../../.env") }); // workspace root

const deployerKey = process.env.DEPLOYER_KEY;
if (!deployerKey) {
  console.warn(
    "DEPLOYER_KEY not found in .env file. Running with default config"
  );
}

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  zksolc: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin
    settings: {},
  },
  defaultNetwork: "sepolia",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      chainId: 11155111,
      url: "https://rpc.sepolia.org/",
      accounts: [deployerKey as string],
    },
    mumbai: {
      chainId: 80001,
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [deployerKey as string],
    },
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: [deployerKey as string],
    },
    arbitrumOne: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [deployerKey as string],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerKey as string],
    },
    zircuit: {
      url: `https://zircuit1.p2pify.com`,
      accounts: [deployerKey as string],
    },
    apeChain: {
      url: "https://jenkins.rpc.caldera.xyz/http",
      accounts: [deployerKey as string],
    },
    morph: {
      url: "https://rpc-quicknode-holesky.morphl2.io",
      accounts: [deployerKey as string],
    },
    zeroTestnet: {
      url: "https://rpc.zerion.io/v1/zero-sepolia",
      zksync: true,
      ethNetwork: "sepolia",
      verifyURL: "https://explorer.zero.network/contract_verification",
      accounts: [deployerKey as string],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerKey as string],
    },
  },
};

export default config;
