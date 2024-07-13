import { useEffect, useState } from "react";

export function useIsHashValid() {
  const [isHashValid, setIsHashValid] = useState(false);

  useEffect(() => {
    console.log("useIsHashValid");
    const submit = async () => {
      try {
        const hash = window.Telegram.WebApp.initData;
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
          setIsHashValid(true);
        }
      } catch (error) { }
    };
    submit();
  }, []);

  return isHashValid;
}