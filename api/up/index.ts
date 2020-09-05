import { NowRequest, NowResponse } from "@vercel/node";
import { json } from "micro";

import { isSecureReq, UpWebhookEvent } from "../../util/up";

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method === "GET") return res.status(200).send("OK");

  if (!(await isSecureReq(req)))
    return res.status(403).json({ status: 403, message: "Forbidden" });

  const body = (await json(req)) as UpWebhookEvent;
  const type = body.data.attributes.eventType;
  console.log(type, body);

  res.send("OK");
};
