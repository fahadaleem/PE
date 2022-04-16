import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    if (method === "GET") {
      const { secId } = req.query;
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
                  ...(!subSubSections.filter(
                    (subSubSection: any) =>
                      subSection.section_id == subSubSection.fk_sub_section
                  ).length && {
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

      data = data.filter((item) => item.mainSection.sectionId == secId);

      res.status(200).json({ status: "success", data });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("error");
  }
}