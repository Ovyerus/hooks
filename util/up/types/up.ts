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
  valueInBaseUnits: number;
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

export interface UpTransactionResponse {
  data: UpTransaction;
}

export interface UpCategory {
  data: {
    type: "categories";
    id: string;
    attributes: {
      name: string;
    };
    relationships: {
      parent: {
        data?: {
          type: string;
          id: string;
        };
        links?: {
          related: string;
        };
      };
      children: {
        data: {
          type: string;
          id: string;
        }[];
        links?: {
          related: string;
        };
      };
    };
    links?: {
      self: string;
    };
  };
}
