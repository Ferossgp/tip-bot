import type { ActionFunctionArgs } from "@remix-run/node";
import { webcrypto } from 'node:crypto';
import { json } from "@remix-run/node";
import { db } from "~/db.server";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (process.env.BOT_TOKEN == null) {
    return json({ message: "Internal server error" }, 500);
  }

  const payload = await request.json();

  const data = Object.fromEntries(new URLSearchParams(payload.hash));
  const isValid = await isHashValid(data, process.env.BOT_TOKEN);

  const userObject = JSON.parse(data.user)

  // TODO: return if user is verified and has a wallet
  const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userObject.id) as {
    user_id: string,
    world_id: string,
    verified: boolean,
  } | undefined

  if (isValid) {
    return json({
      ok: true,
      isHashValid: true,
      verified: user?.verified,
      hasWallet: false,
    }, 200);
  }
};

async function isHashValid(data: Record<string, string>, botToken: string) {
  const encoder = new TextEncoder();

  const checkString = Object.keys(data)
    .filter((key) => key !== 'hash')
    .map((key) => `${key}=${data[key]}`)
    .sort()
    .join('\n');

  const secretKey = await webcrypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign']
  );

  const secret = await webcrypto.subtle.sign('HMAC', secretKey, encoder.encode(botToken));

  const signatureKey = await webcrypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign']
  );

  const signature = await webcrypto.subtle.sign('HMAC', signatureKey, encoder.encode(checkString));

  const hex = Buffer.from(signature).toString('hex');

  return data.hash === hex;
}
