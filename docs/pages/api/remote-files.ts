// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getDemoFiles } from "../../lib/remote-source";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { src } = req.query;
  if (Array.isArray(src) || !src) {
    return res.status(400).json({
      error: "src must be a string",
    });
  }
  res.json({
    files: await getDemoFiles(src),
  });
}
