import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db-config";

interface IResponse {
  status: string;
  sections?: any[];
  message?: string;
}

export default async function sections(
  req: NextApiRequest,
  res: NextApiResponse<IResponse | string>
) {
  try {
    const { method } = req;
    if (method === "GET") {
      const sections = await db.any("SELECT * FROM sub_sections", [true]);
      res.status(200).json({ status: "success", sections });
      return;
    }
    res.send("Method not accepted");
  } catch (e: any) {
    console.log(e);
    res.status(402).json({ status: "error", message: "Internal server error" });
  }
}
