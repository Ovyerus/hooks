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

export type UpTransactionStatus = "HELD" | "SETTLED";

export interface Relationship<T extends string = string> {
  data: {
    type: T;
    id: string;
  };
  links?: {
    related?: string;
    self?: string;
  };
}

export interface MultiRelationship<T extends string = string> {
  data: Array<{
    type: T;
    id: string;
  }>;
  links?: {
    related?: string;
    self?: string;
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
      webhook: Relationship<"webhooks">;
      transaction: Relationship<"transactions">;
    };
  };
}

export interface UpMoneyObject {
  currencyCode: string;
  value: string;
  valueInBaseUnits: string;
}

export interface UpTransaction {
  type: "transactions";
  id: string;
  attributes: {
    status: UpTransactionStatus;
    rawText?: string;
    description: string;
    message?: string;
    holdInfo?: {
      amount: UpMoneyObject;
      foreignAmount?: UpMoneyObject;
    };
    roundUp?: {
      amount: UpMoneyObject;
      boostPortion?: UpMoneyObject;
    };
    cashback?: {
      description: string;
      amount: UpMoneyObject;
    };
    amount: UpMoneyObject;
    foreignAmount?: UpMoneyObject;
    settledAt?: string;
    createdAt?: string;
  };
  relationships: {
    account: Relationship<"accounts">;
    category: Relationship<"categories">;
    parentCategory: Relationship<"categories">;
    tags: MultiRelationship<"tags">;
  };
  links?: {
    self: string;
  };
}
