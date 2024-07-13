import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { AppRoot } from "@telegram-apps/telegram-ui";
import "@telegram-apps/telegram-ui/dist/styles.css";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  DynamicContextProvider,
  mergeNetworks,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
const queryClient = new QueryClient()

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppRoot style={{
            backgroundColor: 'var(--tgui--bg_color)'
          }}>
            <DynamicContextProvider
              settings={{
                environmentId: "89a3e926-214b-48b4-be7f-3e48b4122059",
                walletConnectors: [EthereumWalletConnectors],
              }}
            >
              {children}
            </DynamicContextProvider>
          </AppRoot>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
