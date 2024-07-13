import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  Button,
  FixedLayout,
  Placeholder,
  Steps,
} from "@telegram-apps/telegram-ui";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { useState } from "react";

const Humanity = ({ onSuccess }: { onSuccess: () => void }) => {
  const onVerify = async (proof: ISuccessResult) => {
    const user_id = window.Telegram.WebApp.initDataUnsafe.user?.id;

    if (user_id == null) throw new Error("User ID is not available");

    const result = await fetch("/store-world-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...proof, user_id: user_id })
    });

    if (result.ok && result.status === 200) {
      onSuccess();
    } else {
      throw new Error("Failed to verify the proof");
    }
  }

  return (
    <>
      <Placeholder
        header="Verify humanity"
        description="To avoid abuse from bots that are farming points, our platform requires you to verify your humanity. Please click the button below to verify."
      >
        <img
          alt="Telegram sticker"
          src="https://stickerdise.com/wp-content/uploads/2022/04/SINGLE516.webp"
          style={{ display: "block", width: "256px", height: "256px" }}
        />
      </Placeholder>

      <IDKitWidget
        app_id="app_d6e36d671cf6eefaacabe9c9c9203a98" // obtained from the Developer Portal
        action="ty-sir-bot" // this is your action id from the Developer Portal
        onSuccess={onSuccess} // callback when the modal is closed
        handleVerify={onVerify} // optional callback when the proof is received
        verification_level={VerificationLevel.Device}
      >
        {({ open }) => (
          <Button onClick={open} stretched>
            Verify with World ID
          </Button>
        )}
      </IDKitWidget>
    </>
  );
};

export const CreateWallet = () => {
  return (
    <>
      <Placeholder
        header="Create a wallet"
        description="To be able to claim the accumulated tokens, please create a secure wallet"
      >
        <img
          alt="Telegram sticker"
          src="https://sl.combot.org/stakemoney/webp/2xf09f92b0.webp"
          style={{ display: "block", width: "256px", height: "256px" }}
        />
      </Placeholder>
      <DynamicWidget />
    </>
  );
};

export const Enroll = ({ initialStep = 1 }: { initialStep: number }) => {
  const [step, setStep] = useState(initialStep);

  return (
    <div className="overflow-y-auto p-4">
      <Steps count={2} progress={step} />
      {step === 1 && <Humanity onSuccess={() => setStep(2)} />}
      {step === 2 && <CreateWallet />}
    </div>
  );
};
