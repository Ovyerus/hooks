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

  res.json({ status: 200, body, query, method });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
