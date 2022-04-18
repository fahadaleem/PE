import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Container,
  TableContainer,
  Heading,
  Box,
  HStack,
  Text,
  Input,
  Radio,
  RadioGroup,
  useToast,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface IQuestions {
  mainSection: {
    sectionTitle: string;
    subSection: {
      sectionTitle: string;
      sectionDescription: string;
      questions: IQuestion[];
    }[];
  };
}

interface IQuestion {
  questionsId: number;
  questiontitle: string;
  questiondescription: string;
  options: IOption[];
}
interface IOption {
  optionTitle: string;
  optionWeightage: string;
}

export const QuestionTable = () => {
  const [questions, setQuestions] = useState<[IQuestions]>();
  const toast = useToast();
  const [formSections, setFormSections] = useState<any[]>();
  const [sectionData, setSectionData] = useState(null);

  const handleDeleteQuestions = async (qid: number) => {
    try {
      const resp = await axios.delete(`/api/questions/${qid}`);

      if (resp.data.status === "success") {
        toast({
          title: "Question deleted.",
          description: "This question is deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // handleGetQuestions();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSections = async () => {
    try {
      const sections = await axios.get("/api/mainSections");
      setFormSections(sections.data.sections);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetSections();
  }, []);

  const handleGetQuestions = async (id) => {
    try {
      const sections = await axios.get(`/api/sections/${id}`);
      setSectionData(sections.data.data[0]?.mainSection);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxW="container.xl" my={8}>
      <Heading>Form</Heading>
      <ButtonGroup>
        {formSections?.map((item: any) => {
          return (
            <Button onClick={() => handleGetQuestions(item.section_id)}>
              {item.section_title}
            </Button>
          );
        })}
      </ButtonGroup>
      {sectionData && (
        <Box my={4}>
          <Heading>{sectionData?.sectionTitle}</Heading>
          {sectionData.subSections?.map((item: any) => {
            return (
              <Box>
                <Heading fontSize={"xl"} px={2} display={"flex"}>
                  {`${item.subSectionTitle}: `}
                  <Text mx={3} fontWeight={300}>
                    {item.subSectionDescription}
                  </Text>
                </Heading>
                <Box px={5}>
                  {item.questions?.map((questions: any) => {
                    return (
                      <Box border={"1px solid #e5e5e5"} p={3} my={3}>
                        <Heading fontSize={"md"}>
                          - {`${questions.questionTitle}:  `}
                          <Text fontWeight={300}>
                            {questions.questionDescription}
                          </Text>
                        </Heading>
                        {questions.options?.map((option: any) => {
                          return (
                            <RadioGroup name="option">
                              <Radio value={option.optionWeightage}>
                                {option.optionTitle}
                              </Radio>
                            </RadioGroup>
                          );
                        })}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
};
