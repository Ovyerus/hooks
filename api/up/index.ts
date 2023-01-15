import { VercelRequest, VercelResponse } from "@vercel/node";
import { json } from "micro";

import { isSecureReq } from "../../util/up";
import { UpWebhookEvent } from "../../util/up/types";
import pingHandler from "../../util/up/pingHandler";
import transactionHandler from "../../util/up/transactionHandler";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") return res.status(200).send("OK");

  if (!(await isSecureReq(req)))
    return res.status(403).json({ status: 403, message: "Forbidden" });

  const body = (await json(req)) as UpWebhookEvent;
  const type = body.data.attributes.eventType;
  // console.log(type, body);

  switch (type) {
    case "PING":
      return pingHandler(req, res);
    case "TRANSACTION_SETTLED":
    case "TRANSACTION_CREATED":
      return transactionHandler(req, res);
    default:
      console.log(`dunno ${type}`);
      return res.send("OK");
  }
};
