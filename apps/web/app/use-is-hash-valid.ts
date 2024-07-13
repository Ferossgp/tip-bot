import { useEffect, useState } from "react";

export function useIsHashValid() {
  const [response, setResponse] = useState({
    isHashValid: false,
    verified: false,
    hasWallet: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const submit = async () => {
      try {
        const hash = window.Telegram?.WebApp.initData;
        const response = await fetch("/validate-hash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hash }),
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        if (json.ok) {
          setResponse(json);
        }
      } catch (error) { }
    };

    window.Telegram.WebApp.ready();

    submit();
  }, []);

  return response;
}