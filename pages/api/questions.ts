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
      const mainSections = await db.any("select * from main_section");
      const questions = await db.any(`select * from questions`);
      const subSections = await db.any("select * from sub_sections;");
      const subSubSections = await db.any("select * from sub_sub_sections;");

      let data = mainSections.map((mainSection: any) => {
        return {
          mainSection: {
            sectionTitle: mainSection.section_title,
            sectionId: mainSection.section_id,
            subSections: subSections
              .filter(
                (subSection: any) =>
                  subSection.fk_main_section == mainSection.section_id
              )
              .map((subSection: any) => {
                return {
                  subSectionId: subSection.section_id,
                  subSectionTitle: subSection.section_title,
                  ...(subSubSections.filter(
                    (subSubSection: any) =>
                      subSection.section_id == subSubSection.fk_sub_section
                  ).length && {
                    subSubSection: subSubSections
                      .filter(
                        (subSubSection: any) =>
                          subSection.section_id == subSubSection.fk_sub_section
                      )
                      .map((subSubSection: any) => {
                        return {
                          subSubSectionId: subSubSection.section_id,
                          subSubSectionTitle: subSubSection.section_title,
                          questions: questions
                            .filter(
                              (question: any) =>
                                question.fk_sub_sub_sections ==
                                subSubSection.section_id
                            )
                            .map((question: any) => {
                              return {
                                questionId: question.question_id,
                                questionTitle: question.question_title,
                                options: question.options,
                              };
                            }),
                        };
                      }),
                  }),
                  questions: questions
                    .filter(
                      (question: any) =>
                        question.fk_sub_sections == subSection.section_id
                    )
                    .map((question: any) => {
                      return {
                        questionId: question.question_id,
                        questionTitle: question.question_title,
                        options: question.options,
                      };
                    }),
                };
              }),
          },
        };
      });

      // let data = mainSections.map((item: any) => {
      //   return {
      //     mainSection: {
      //       sectionTitle: item.sectiontitle,
      //       subSection: sections
      //         .filter(
      //           (section: any) => section.fk_mainsection == item.sectionid
      //         )
      //         .map((subSection: any) => {
      //           return {
      //             sectionTitle: subSection.sectiontitle,
      //             sectionDescription: subSection.sectiondescription,
      //             questions: questions.filter(
      //               (question: any) =>
      //                 Number(question.fk_formsections) ===
      //                 Number(subSection.sectionid)
      //             ),
      //           };
      //         }),

      //     },
      //   };
      // });

      res.status(200).json({ status: "success", data });
    } else if (method === "POST") {
      const {
        body: {
          mainSection,
          questionTitle,
          questionDescription,
          options,
          subSection,
          subSubSection,
        },
      } = req;

      // if (!subSubSection) {
      await db.query(
        `INSERT INTO questions (question_title, question_description, options, fk_sub_sections, fk_sub_sub_sections ) VALUES 
('${questionTitle}', '${questionDescription}', '${JSON.stringify(
          options
        )}', ${subSection}, null)`
      );
      //       } else {
      //         const resp = await db.query(
      //           // `INSERT INTO sub_sub_sections (section_title, fk_sub_section) VALUES ('${subSubSection}',${subSection} )`
      //           `INSERT INTO sub_sub_sections (section_title, fk_sub_section) VALUES ('${subSubSection}',${subSection} );
      // SELECT * FROM sub_sub_sections where section_title='${subSubSection}' LIMIT 1;`
      //         );

      //         await db.query(
      //           `INSERT INTO questions (question_title, question_description, options, fk_sub_sections, fk_sub_sub_sections ) VALUES
      //         ('${questionTitle}', '${questionDescription}', '${JSON.stringify(
      //             options
      //           )}', null, ${resp[0].section_id})`
      //         );
      //       }

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
