// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db-config";
import initMiddleware from "../../../lib/init-middlerware";
import Cors from "cors";

interface Data {
  status: string;
  students?: {
    pno: number;
    userName: string;
    fatherName: string;
    branchName: string;
    unit: string;
    isEvaluate: boolean;
    courseName: string;
  };
  message?: string;
}

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function students(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await cors(req, res);
  const { method } = req;
  if (method === "GET") {
    const students = await db.query("select * from students;");
    res.status(200).json({ status: "success", students });
  }
}
