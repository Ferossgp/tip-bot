import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getUserKarma } from "bot/utils";
import { db } from "~/db.server";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  if (!params.id) throw new Error("No user id");

  const balances = await getUserKarma(db, Number(params.id)) ?? [];

  return json(balances.filter((balance) => balance.balance > 0));
}
