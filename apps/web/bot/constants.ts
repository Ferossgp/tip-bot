export type Chains = 'ape-chain' | 'sepolia' | 'zero-chain' | 'base-sepolia' | 'arbitrum-sepolia' | 'zircuit-testnet' | 'morph-holesky' | 'scroll-sepolia'
export const tokens = [
  {
    name: 'ApeCoin',
    symbol: 'APE',
    chain: 'ape-chain',
  },
  {
    name: 'Nouns',
    symbol: 'NOUNS',
    chain: 'sepolia',
  },
  {
    name: 'Zero',
    symbol: 'ZERO',
    chain: 'zero-chain',
  },
  {
    name: 'Based Sir',
    symbol: 'BSIR',
    chain: 'base-sepolia',
  },
  {
    name: 'Arbitrum',
    symbol: 'ARB',
    chain: 'arbitrum-sepolia',
  },
  {
    name: 'Zircuit Testnet',
    symbol: 'ZIR',
    chain: 'zircuit-testnet',
  },
  {
    name: 'Morph Holesky',
    symbol: 'MORPH-SIR',
    chain: 'morph-holesky',
  },
  {
    name: 'Scroll Sepolia',
    symbol: 'SCROLL-SIR',
    chain: 'scroll-sepolia',
  }
] as const

export function getChainFromToken(token: string): Chains | undefined {
  return tokens.find(t => t.symbol === token.toUpperCase())?.chain
}