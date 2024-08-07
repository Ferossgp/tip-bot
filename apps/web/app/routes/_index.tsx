import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Placeholder, Spinner } from '@telegram-apps/telegram-ui';
import { ClientOnly } from "remix-utils/client-only";
import { Balances } from "~/components/balances";
import { Enroll } from "~/components/enroll";
import { useIsHashValid } from "~/use-is-hash-valid";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const LoaderUi = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Spinner size="l" />
    </div>
  );
}

const BotContent: React.FC = () => {
  const response = useIsHashValid();
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    return <Balances />;
  }

  if (response.isHashValid) {
    return <Enroll initialStep={response.verified ? 2 : 1} />;
  }

  return <LoaderUi />
}

export default function Index() {
  return <ClientOnly fallback={null}>{() => <BotContent />}</ClientOnly>;
}
