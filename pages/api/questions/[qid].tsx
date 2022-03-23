import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "DELETE") {
    const { qid } = req.query;
    await db.query(`delete from questions where id=${qid}`);
    res.status(200).json({
      status: "success",
      message: "user deleted successfully",
    });
  }
}
