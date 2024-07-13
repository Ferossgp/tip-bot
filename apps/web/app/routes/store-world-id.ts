import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  ISuccessResult,
  type IVerifyResponse,
  verifyCloudProof,
} from "@worldcoin/idkit";
import { db } from "~/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const proof = (await request.json()) as ISuccessResult & { user_id: string };
  const app_id = process.env.APP_ID as `app_${string}`;
  const action = process.env.ACTION_ID;
  if (!app_id || !action) {
    return json({ message: "App ID or Action ID not set" }, 500);
  }

  const verifyRes = (await verifyCloudProof(
    {
      proof: proof.proof,
      merkle_root: proof.merkle_root,
      nullifier_hash: proof.nullifier_hash,
      verification_level: proof.verification_level,
    },
    app_id,
    action
  )) as IVerifyResponse;

  if (verifyRes.success) {
    db.prepare(
      `INSERT INTO users (user_id, world_id, verified) VALUES (@user_id, @world_id, @verified)`
    ).run(
      {
        user_id: proof.user_id,
        world_id: JSON.stringify({
          proof: proof.proof,
          merkle_root: proof.merkle_root,
          nullifier_hash: proof.nullifier_hash,
          verification_level: proof.verification_level,
        }),
        verified: 1
      }
    );
    return json(verifyRes);
  } else {
    // This is where you should handle errors from the World ID /verify endpoint.
    // Usually these errors are due to a user having already verified.
    return json(verifyRes, 400);
  }
};
