// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db-config";
import initMiddleware from "../../lib/init-middlerware";
import Cors from "cors";

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

type Data = {
  status: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  message?: string;
};

export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await cors(req, res);
  try {
    const {
      body: { email, password },
      method,
    } = req;
    if (method === "POST") {
      const user = await db.one(
        `SELECT * from users where email='${email}' and password='${password}';`
      );

      const data = {
        status: "success",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
      res.status(200).json(data);
    }

    // success
  } catch (e: any) {
    console.log(e);
    // error
    res.status(400).json({ status: "error", message: "User does not exist" });
  }
}
