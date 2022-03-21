// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db-config";

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
    // error
    if (e.code === 0)
      res.status(400).json({ status: "error", message: "User does not exist" });
  }
}
