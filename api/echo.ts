import { text } from "micro";

import { NowRequest, NowResponse } from "@vercel/node";

const tryFn = (fn) => {
  try {
    return fn();
  } catch {
    return null;
  }
};

export default async (req: NowRequest, res: NowResponse) => {
  const rawBody = await text(req);
  const body = await tryFn(() => JSON.parse(rawBody));
  const { query, method } = req;
  const resp = { status: 200, body, rawBody, query, method };

  if (req.query.formatted == null)
    res.json({ status: 200, body, rawBody, query, method });
  else {
    const fmtResp = JSON.stringify(
      { status: 200, body, rawBody, query, method },
      null,
      4
    );

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(fmtResp);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
