import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db-config";

export default async function question(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    // GET
    // POST
    // DELETE
    // PUT
    if (method === "GET") {
      const sections = await db.any("select * from formSection");
      const questions = await db.any(`select * from questions`);
      const mainSections = await db.any("select * from main_sections;");
      console.log(mainSections);

      let data = mainSections.map((item: any) => {
        return {
          mainSection: {
            sectionTitle: item.sectiontitle,
            subSection: sections
              .filter(
                (section: any) => section.fk_mainsection == item.sectionid
              )
              .map((subSection: any) => {
                return {
                  sectionTitle: subSection.sectiontitle,
                  sectionDescription: subSection.sectiondescription,
                  questions: questions.filter(
                    (question: any) =>
                      Number(question.fk_formsections) ===
                      Number(subSection.sectionid)
                  ),
                };
              }),
            // subSection: sections.filter((section: any) => {
            //   if (section.fk_mainsection == item.sectionid)
            //     return {
            //       sectionTitle: section.sectiontitle,
            //       sectionDescription: section.sectiondescription,
            //       questions: questions.filter(
            //         (question: any) =>
            //           Number(question.fk_formsections) ===
            //           Number(section.sectionid)
            //       ),
            //     };
            // }),
          },
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
    console.log(err);
    res.status(401).json({ status: "error", message: "Something went wrong" });
  }
}
