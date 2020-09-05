import { NowRequest, NowResponse } from "@vercel/node";

export default ({ body, query, method }: NowRequest, res: NowResponse) => {
  res.json({ status: 200, body, query, method });
};
