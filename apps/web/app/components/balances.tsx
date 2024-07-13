import {
  Avatar,
  Badge,
  Button,
  Cell,
  LargeTitle,
  List,
  Modal,
  Placeholder,
} from "@telegram-apps/telegram-ui";

const BalanceRow = () => {
  return (
    <Modal
      overlayComponent={<Modal.Overlay style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} />}
      trigger={
        <Cell
          after={<Badge type="number">99</Badge>}
          before={<Avatar size={48} />}
          titleBadge={<Badge type="dot" />}
        >
          $APE
        </Cell>
      }
    >
      <div className="p-4">
        <Placeholder description="Description" header="Title">
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{
              display: "block",
              height: "144px",
              width: "144px",
            }}
          />
        </Placeholder>
        <Button stretched>Claim all tokens</Button>
      </div>
    </Modal>
  );
};

export const Balances = () => {
  return (
    <div>
      <List>
        <LargeTitle weight="1">Unclaimed Balances</LargeTitle>
        <BalanceRow />
      </List>
    </div>
  );
};
