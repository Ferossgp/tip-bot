# Telegram Bot for tipping

## Deployed contracts

- [Sepolia](https://sepolia.etherscan.io/address/0xf62d149d96060d6804C12814fD6f387A47C42654)
- [Base Sepolia](https://base-sepolia.blockscout.com/address/0x106aD991745e304e3C2175836dB85AE88FfddBB0)
- [Arbitrum](https://sepolia.arbiscan.io/address/0x03DF7a86c1506FfFDE626b3F02aF0a4e01E1395a)
- [Zircuit](https://explorer.zircuit.com/address/0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582)
- [Morph](https://explorer-holesky.morphl2.io/address/0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582)
- [Scroll Sepolia](https://sepolia.scrollscan.com/address/0x27eb1cce195749980c93a066cc99dc5de58d9582)
- [Ape Chain](https://jenkins.explorer.caldera.xyz/address/0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582)

### Apps and Packages

- `web`: Telegram bot and mini app
- `hardhat`: a Hardhat project to develop and deploy Ethereum smart contracts

### Develop

To run the Telegram mini app UI go to `apps/web` and run:

```sh
pnpm dev
```

To start the bot service run:

```sh
pnpm dev:bot
```

### Deploy on fly.io

To deploy bot and mini app to fly.io using docker, first install the fly cli:

```sh
curl -L https://fly.io/install.sh | sh
```

Create a volume for sqlite

```sh
fly volumes create litefs --size 1
```

Create a new app:

```sh
fly launch
```

Configure the consul:

```sh
fly consul attach
```
