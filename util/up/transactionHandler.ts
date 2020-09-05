import { NowRequest, NowResponse } from "@vercel/node";
import { json } from "micro";
import { UpWebhookEvent } from ".";
import { getTransaction, sendWebhook } from "./requests";
import util from "util";

export default async (req: NowRequest, res: NowResponse) => {
  const body = (await json(req)) as UpWebhookEvent;
  const transId = body.data.relationships.transaction.data.id;
  const { data: transaction } = await getTransaction(transId);

  const { status, description } = transaction.attributes;
  const tags = transaction.relationships.tags.data.map((t) => t.id).join(", ");

  console.log(transaction.id, description, status);
  if (status === "HELD" || description === "Round Up") return res.send("OK");

  await sendWebhook(
    `<@99742488666845184> transaction with **${description}** settled.\nTags: \`${tags}\``
  );

  res.send("OK");
};
