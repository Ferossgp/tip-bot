import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useMutation, useQuery } from "@tanstack/react-query";
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
} from "@telegram-apps/telegram-ui";
import { KarmaResponse } from "bot/utils";
import nouns from "~/images/nouns.jpg";
import ape from "~/images/apecoin.png";
import {
  Account,
  Chain,
  Hex,
  Transport,
  WalletClient,
  PublicClient,
  parseEther,
} from "viem";

const tokenIdToAvatar = {
  ape,
  nouns
} as Record<string, string>;

const BalanceRow = ({ balance }: { balance: KarmaResponse }) => {
  const { primaryWallet } = useDynamicContext();

  const { mutate, data, status } = useMutation({
    mutationKey: ["claim", balance.userId, balance.tokenId],
    mutationFn: async () => {
      if (!primaryWallet) return null;

      const provider = await primaryWallet.connector.getSigner<
        WalletClient<Transport, Chain, Account>
      >();

      if (!provider) return;

      // const proof = await fetch("/claim", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     user_id: balance.userId,
      //     token_id: balance.tokenId,
      //   }),
      // });

      // TODO: Claim from contract
      const transaction = {
        account: primaryWallet.address as Hex,
        chain: await provider.getChainId(),
      };

      console.log(transaction);

      const hash = await provider.sendTransaction(transaction);

      const client =
        await primaryWallet.connector.getPublicClient<PublicClient>();

      const { transactionHash } = await client.getTransactionReceipt({
        hash,
      });

      return transactionHash;
    },
  })

  const claim = () => mutate()

  const openBlockscout = () => {
    alert('TODO: Open blockscout')
  }

  return (
    <Modal
      overlayComponent={
        <Modal.Overlay style={{ backgroundColor: "rgba(0,0,0,0.6)" }} />
      }
      trigger={
        <Cell
          after={<Badge type="number">{balance.balance}</Badge>}
          before={<Avatar size={48} src={tokenIdToAvatar[balance.tokenId]} />}
          titleBadge={<Badge type="dot" />}
        >
          ${balance.tokenId.toUpperCase()}
        </Cell>
      }
    >
      <div className="p-4 pb-safe-offset-4">
        {data ? (
          <Button stretched onClick={openBlockscout}>View on Blockscout</Button>
        ) : (
          <>
            <Placeholder description={`You have a balance of ${balance.balance} $${balance.tokenId.toUpperCase()}`} header={`$${balance.tokenId.toUpperCase()}`}>
              <Avatar size={96} src={tokenIdToAvatar[balance.tokenId]} />
            </Placeholder>
            <Button stretched onClick={claim}>{status === 'pending' ? <Spinner size="s" /> : "Claim all tokens"}</Button>
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
      return fetch(`/balances/${uid}`).then((res) => res.json() as Promise<KarmaResponse[]>);
    },
  });

  return (
    <div>
      <DynamicWidget />

      <List>
        <LargeTitle weight="1">Unclaimed Balances</LargeTitle>
        {status === "pending" ? (
          <Spinner size="l" />
        ) : data.length === 0 ? (
          <Placeholder description="You do not have any active balances" header="No balances">
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
          data.map((item) => <BalanceRow balance={item} />)
        )}
      </List>
    </div>
  );
};
