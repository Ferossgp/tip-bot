import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Placeholder, Spinner } from '@telegram-apps/telegram-ui';
import { ClientOnly } from "remix-utils/client-only";
import { useIsHashValid } from "~/use-is-hash-valid";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const BotContent: React.FC = () => {
  const isHashValid = useIsHashValid();

  if (isHashValid) {
    return (
      <Placeholder
        header="Title"
        description="Description"
      >
        <img
          alt="Telegram sticker"
          src="https://xelene.me/telegram.gif"
          style={{ display: 'block', width: '144px', height: '144px' }}
        />
      </Placeholder>
    );
  }

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Spinner size="l" />
    </div>
  );
}

export default function Index() {
  return <ClientOnly fallback={null}>{() => <BotContent />}</ClientOnly>;
}
