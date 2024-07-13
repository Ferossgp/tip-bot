import { ActionFunctionArgs, json } from "@remix-run/node";
import { claimKarma } from "bot/utils";
import { db } from "~/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const body = (await request.json()) as { user_id: string; token_id: string };

  await claimKarma(db, Number(body.user_id), body.token_id);

  // TODO: Return a proof that user can claim with
  return json({ ok: true })
};