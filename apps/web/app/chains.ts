import { Chains } from 'bot/constants'
import { Chain, defineChain } from 'viem'
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
import { morphHolesky, scrollSepolia, sepolia, baseSepolia, arbitrumSepolia, zircuitTestnet } from 'viem/chains'

// TODO: add blockscout to all
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