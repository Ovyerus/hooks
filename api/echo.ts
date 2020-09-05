import { NowRequest, NowResponse } from "@vercel/node";

export default ({ body, query }: NowRequest, res: NowResponse) => {
  res.json({ status: 200, body, query });
};
