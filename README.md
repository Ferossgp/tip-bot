# Telegram Bot for tipping

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
