import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Cell,
  LargeTitle,
  List,
  Modal,
  Placeholder,
  Spinner,
  Title,
} from "@telegram-apps/telegram-ui";
import { KarmaResponse } from "bot/utils";
import {
  Account,
  Chain,
  Hex,
  Transport,
  WalletClient,
  PublicClient,
  createWalletClient,
  http,
  createPublicClient,
  getContract,
} from "viem";
import {
  chainIdToChain,
  chainIdToContractAddress,
  chainIdToTokenAddress,
  tokenIdToAvatar,
  zeroChain,
} from "~/chains";
import { Chains, getChainFromToken, tokens } from "bot/constants";
import { contractAbi } from "~/contract";

const BalanceRow = ({ balance }: { balance: KarmaResponse }) => {
  const { primaryWallet } = useDynamicContext();
  const queryClient = useQueryClient();
  const { mutate, data, status } = useMutation({
    mutationKey: ["claim", balance.userId, balance.tokenId],
    mutationFn: async () => {
      if (!primaryWallet) return null;

      const provider =
        await primaryWallet.connector.getSigner<
          WalletClient<Transport, Chain, Account>
        >();


      if (!provider) return;

      const chainId = getChainFromToken(balance.tokenId);

      const chain = chainId ? chainIdToChain[chainId] : undefined;
      const tokenAddress = chainId ? chainIdToTokenAddress[chainId] : undefined;
      const contractAddress = chainId
        ? chainIdToContractAddress[chainId]
        : undefined;
      if (!chain || !contractAddress || !tokenAddress) return;

      const client = createWalletClient({
        account: provider.account,
        chain: chain,
        transport: http(chain.rpcUrls.default.http[0]),
      });

      const publicClient = createPublicClient({
        chain: chain,
        transport: http(chain.rpcUrls.default.http[0]),
      });

      // const proof = await fetch("/claim", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     user_id: balance.userId,
      //     token_id: balance.tokenId,
      //   }),
      // });

      const contract = getContract({
        address: contractAddress,
        abi: contractAbi,
        client: { public: publicClient, wallet: client },
      });

      // TODO: Claim from contract
      const hash = await contract.write.claimTokens([
        tokenAddress,
        BigInt(balance.balance),
      ]);

      const { transactionHash } = await publicClient.waitForTransactionReceipt({
        hash,
      });

      const blockscout = chain.blockExplorers?.default.url;

      return `${blockscout}/tx/${transactionHash}`;
    },
    onError: (error) => {
      console.error(error);
      alert(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["balances"],
      });
    }
  });

  const claim = () => mutate();

  const openBlockscout = () => {
    if (!data) return;

    window.open(data, "_blank");
  };

  const avatar = tokenIdToAvatar[balance.tokenId];

  return (
    <Modal
      overlayComponent={
        <Modal.Overlay style={{ backgroundColor: "rgba(0,0,0,0.6)" }} />
      }
      trigger={
        <Cell
          after={<Badge type="number">{balance.balance}</Badge>}
          before={<Avatar size={48} src={avatar} />}
          titleBadge={<Badge type="dot" />}
        >
          ${balance.tokenId.toUpperCase()}
        </Cell>
      }
    >
      <div className="p-4 pb-safe-offset-4">
        {data ? (
          <div className="flex gap-4">
            <Title className="text-center">Success!</Title>
            <Button stretched onClick={openBlockscout}>
              View on Blockscout
            </Button>
          </div>
        ) : (
          <>
            <Placeholder
              description={`You have a balance of ${balance.balance
                } $${balance.tokenId.toUpperCase()}`}
              header={`$${balance.tokenId.toUpperCase()}`}
            >
              <Avatar size={96} src={avatar} />
            </Placeholder>
            <Button stretched onClick={claim}>
              {status === "pending" ? <Spinner size="s" /> : "Claim all tokens"}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export const Balances = () => {
  const { data, status } = useQuery({
    queryKey: ["balances"],
    queryFn: () => {
      const uid = window.Telegram.WebApp.initDataUnsafe.user?.id;
      if (!uid) throw new Error("No user id");
      return fetch(`/balances/${uid}`).then(
        (res) => res.json() as Promise<KarmaResponse[]>
      );
    },
  });

  return (
    <div className="h-full">
      <DynamicWidget />

      <List className="overflow-y-auto">
        <LargeTitle weight="1">Unclaimed Balances</LargeTitle>
        {status === "pending" ? (
          <Spinner size="l" />
        ) : data?.length === 0 ? (
          <Placeholder
            description="You do not have any active balances"
            header="No balances"
          >
            <img
              alt="Telegram sticker"
              src="https://sl.combot.org/poorbase/webp/2xf09f988e.webp"
              style={{
                display: "block",
                height: "144px",
                width: "144px",
              }}
            />
          </Placeholder>
        ) : (
          data?.map((item) => <BalanceRow key={item.tokenId} balance={item} />)
        )}
      </List>
    </div>
  );
};
