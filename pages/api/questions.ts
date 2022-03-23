import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db-config";

export default async function question(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    if (method === "GET") {
      const sections = await db.any("select * from formSection");
      const questions = await db.any(`select * from questions`);
      let data = sections.map((item: any) => {
        return {
          sectionTitle: item.sectiontitle,
          sectionDescription: item.sectiondescription,
          questions: questions.filter(
            (question: any) =>
              Number(question.fk_formsections) === Number(item.sectionid)
          ),
        };
      });

      data = data.map((dataItem: any) => {
        return {
          ...dataItem,
          questions: dataItem.questions.map((item: any) => {
            return {
              questionsId: item.id,
              questionTitle: item.questiontitle,
              questionDescription: item.questiondescription,
              options: item.options,
            };
          }),
        };
      });

      res.status(200).json({ status: "success", data });
    } else if (method === "POST") {
      const {
        body: { sectionId, questionTitle, questionDescription, options },
      } = req;
      await db.query(
        `INSERT INTO questions (questiontitle, questiondescription, options, fk_formsections) VALUES ('${questionTitle}', '${questionDescription}', '${JSON.stringify(
          options
        )}', ${sectionId})`
      );
      res
        .status(200)
        .json({ status: "success", message: "Data added successfully!" });
    } else if (method === "DELETE") {
    }
  } catch (err: any) {
    res.status(401).json({ status: "error", message: "Something went wrong" });
  }
}
