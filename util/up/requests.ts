import bent from "bent";
import { UpTransactionResponse } from ".";

// https://api.up.com.au/api/v1/transactions
const base = "https://api.up.com.au/api/v1/";
const post = bent("json", "POST");

const getUp = bent(base, "json", {
  Authorization: `Bearer ${process.env.UP_TOKEN}`,
});

export const sendWebhook = (content: string) =>
  post(process.env.DISCORD_WEBHOOK, {
    content,
    avatar_url: "https://up.com.au/favicon.ico",
    username: "Up",
  });

export const getTransaction = (id: string): Promise<UpTransactionResponse> => {
  return getUp(`transactions/${id}`) as any;
};
