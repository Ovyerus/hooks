import { NowRequest, NowResponse } from "@vercel/node";

export default (req: NowRequest, res: NowResponse) => {
  console.log(req.body);
  res.status(200).send(null);
};
