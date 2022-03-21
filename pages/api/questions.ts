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
          //   questions: questions.filter(
          //     (question: any) =>
          //       Number(question.fk_sections) === Number(item.sectionid)
          //   ),
          questions: questions.map((question: any) => {
            if (Number(question.fk_formsections) === Number(item.sectionid)) {
              return {
                questionsId: question.id,
                questionTitle: question.questiontitle,
                questionDescription: question.questiondescription,
                options: question.options,
              };
            }
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
    }
  } catch (err: any) {
    res.status(401).json({ status: "error", message: "Something went wrong" });
  }
}
