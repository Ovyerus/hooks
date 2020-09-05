import { NowRequest, NowResponse } from "@vercel/node";

export default (req: NowRequest, res: NowResponse) => {
  console.log(req.body);
  console.log(req.headers);
  res.status(200).send("OK");
};
