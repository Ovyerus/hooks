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

export type UpWebhookEventType =
  | "TRANSACTION_CREATED"
  | "TRANSACTION_SETTLED"
  | "TRANSACTION_DELETED"
  | "PING";

export interface UpRelationship<T extends string = string> {
  data: {
    type: T;
    id: string;
  };
  links?: {
    related: string;
  };
}

export interface UpWebhookEvent {
  data: {
    type: string;
    id: string;
    attributes: {
      eventType: UpWebhookEventType;
      createdAt: string;
    };
    relationships: {
      webhook: UpRelationship<"webhooks">;
      transaction: UpRelationship<"transactions">;
    };
  };
}
