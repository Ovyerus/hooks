import { NowRequest, NowResponse } from "@vercel/node";

import { isSecureReq } from "~util/up";

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method === "GET") return res.status(200).send("OK");

  const secured = await isSecureReq(req);
  console.log(secured);
  // console.log(req.body);
  // console.log(req.headers);
};
