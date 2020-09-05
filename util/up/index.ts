import { NowRequest } from "@vercel/node";
import { text } from "micro";

import crypto from "crypto";

export async function isSecureReq(req: NowRequest) {
  const body = await text(req);
  const secret = process.env.UP_WEBHOOK_SECRET_KEY;
  const signature = req.headers["x-up-authenticity-signature"];

  if (!signature) return false;

  const signer = crypto.createHmac("sha256", secret);
  const hmac = signer.update(body).digest("hex");

  return signature === hmac;
}
