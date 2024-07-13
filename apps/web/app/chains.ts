import { Chains } from 'bot/constants'
import { Address, Chain, defineChain } from 'viem'
import nouns from "~/images/nouns.jpg";
import ape from "~/images/apecoin.png";

export const tokenIdToAvatar = {
  'ape': ape,
  'nouns': nouns,
} as Record<string, string>

export const zeroChain = defineChain({
  id: 4457845,
  name: 'Zero',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://explorer.zero.network',
    }
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.zerion.io/v1/zero-sepolia'],
    },
  },
})

export const apeChain = defineChain({
  id: 1798,
  name: 'Ape Chain',
  rpcUrls: {
    default: {
      http: ['https://jenkins.rpc.caldera.xyz/http'],
      webSocket: ['wss://jenkins.rpc.caldera.xyz/ws'],
    }
  },
  blockExplorers: {
    default: {
      name: 'ApeScan',
      url: 'https://jenkins.explorer.caldera.xyz/',
    }
  },
  nativeCurrency: {
    name: 'ApeCoin',
    symbol: 'APE',
    decimals: 18,
  }
})
import { morphHolesky, scrollSepolia, sepolia as viemSepolis, baseSepolia as viemBaseScan, arbitrumSepolia as viemArbSepolia, zircuitTestnet } from 'viem/chains'

const sepolia = {
  ...viemSepolis,
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://eth-sepolia.blockscout.com/',
    },
  },
} as const

const baseSepolia = {
  ...viemBaseScan,
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://base-sepolia.blockscout.com/',
    },
  },
}
const arbitrumSepolia = {
  ...viemArbSepolia,
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://sepolia-explorer.arbitrum.io/',
    },
  },
}

export { morphHolesky, scrollSepolia, sepolia, baseSepolia, arbitrumSepolia, zircuitTestnet }

export const supportedDynamicNetworks = [
  {
    blockExplorerUrls: apeChain.blockExplorers.default.url,
    chainId: apeChain.id,
    chainName: apeChain.name,
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: apeChain.name,
    nativeCurrency: apeChain.nativeCurrency,
    networkId: apeChain.id,
    rpcUrls: apeChain.rpcUrls.default.http,
    vanityName: apeChain.name,
  },
  {
    blockExplorerUrls: zeroChain.blockExplorers.default.url,
    chainId: zeroChain.id,
    chainName: zeroChain.name,
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: zeroChain.name,
    nativeCurrency: zeroChain.nativeCurrency,
    networkId: zeroChain.id,
    rpcUrls: zeroChain.rpcUrls.default.http,
    vanityName: zeroChain.name,
  },
  {
    blockExplorerUrls: sepolia.blockExplorers.default.url,
    chainId: sepolia.id,
    chainName: sepolia.name,
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: sepolia.name,
    nativeCurrency: sepolia.nativeCurrency,
    networkId: sepolia.id,
    rpcUrls: sepolia.rpcUrls.default.http,
    vanityName: sepolia.name,
  },
  {
    blockExplorerUrls: baseSepolia.blockExplorers.default.url,
    chainId: baseSepolia.id,
    chainName: baseSepolia.name,
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: baseSepolia.name,
    nativeCurrency: baseSepolia.nativeCurrency,
    networkId: baseSepolia.id,
    rpcUrls: baseSepolia.rpcUrls.default.http,
    vanityName: baseSepolia.name,
  },
  {
    blockExplorerUrls: arbitrumSepolia.blockExplorers.default.url,
    chainId: arbitrumSepolia.id,
    chainName: arbitrumSepolia.name,
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: arbitrumSepolia.name,
    nativeCurrency: arbitrumSepolia.nativeCurrency,
    networkId: arbitrumSepolia.id,
    rpcUrls: arbitrumSepolia.rpcUrls.default.http,
    vanityName: arbitrumSepolia.name,
  },
  {
    blockExplorerUrls: zircuitTestnet.blockExplorers.default.url,
    chainId: zircuitTestnet.id,
    chainName: zircuitTestnet.name,
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: zircuitTestnet.name,
    nativeCurrency: zircuitTestnet.nativeCurrency,
    networkId: zircuitTestnet.id,
    rpcUrls: zircuitTestnet.rpcUrls.default.http,
    vanityName: zircuitTestnet.name,
  },
]

export const chainIdToChain: Record<Chains, Chain> = {
  'ape-chain': apeChain,
  'zero-chain': zeroChain,
  'morph-holesky': morphHolesky,
  'scroll-sepolia': scrollSepolia,
  'sepolia': sepolia,
  'base-sepolia': baseSepolia,
  'arbitrum-sepolia': arbitrumSepolia,
  'zircuit-testnet': zircuitTestnet,
}

export const chainIdToContractAddress: Record<Chains, Address> = {
  'ape-chain': '0x0',
  'zero-chain': '0x0',
  'morph-holesky': '0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582',
  'scroll-sepolia': '0x0',
  'sepolia': '0xf62d149d96060d6804C12814fD6f387A47C42654',
  'base-sepolia': '0x106aD991745e304e3C2175836dB85AE88FfddBB0',
  'arbitrum-sepolia': '0x03DF7a86c1506FfFDE626b3F02aF0a4e01E1395a',
  'zircuit-testnet': '0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582',
}

export const chainIdToTokenAddress: Record<Chains, Address> = {
  'ape-chain': '0x0',
  'zero-chain': '0x0',
  'morph-holesky': '0x9F7921d02e1740c4Dbf26c65CB9B263a93edB0A5',
  'scroll-sepolia': '0x0',
  'sepolia': '0x34182d56d905a195524a8f1813180c134687ca34',
  'base-sepolia': '0xA830d481741cE7b0A2E0a0e2a780079f10B87d0c',
  'arbitrum-sepolia': '0x4e5CB09A5dCbAd6aa54a8aaA29b7F50C32349fB2',
  'zircuit-testnet': '0xaa6dA3B886Fa13ABF371B18Cae7A1c4EAa0DdB6C',
}