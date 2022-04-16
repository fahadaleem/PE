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
        handleGetQuestions();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetQuestions = async () => {
    try {
      const resp = await axios.get("/api/questions");
      setQuestions(resp.data.data);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetQuestions();
  }, []);
  return (
    <Container maxW="container.xl" my={8}>
      <Heading>Form</Heading>
      {questions?.length &&
        questions.map((item, index) => {
          return (
            <Box key={index} my={7}>
              <Heading>{item.mainSection.sectionTitle}</Heading>
              {item.mainSection.subSection.length > 0 &&
                item.mainSection.subSection.map((subSection) => {
                  return (
                    <Box>
                      <HStack>
                        <Heading size="md">{subSection.sectionTitle}:</Heading>
                        <Text size="sm">{subSection.sectionDescription} </Text>
                      </HStack>
                      {subSection.questions.map((question, quekey) => {
                        return (
                          <>
                            <Box
                              border="1px solid gray"
                              p={4}
                              my={3}
                              key={quekey}
                            >
                              <Box flex={2}>
                                <Heading size="md" fontWeight={600}>
                                  {question.questiontitle}
                                </Heading>
                                <Text fontWeight={300}>
                                  {question.questiondescription}
                                </Text>
                              </Box>

                              <RadioGroup flex={2}>
                                {question.options.map((option, optionKey) => {
                                  return (
                                    <Box key={option.optionWeightage}>
                                      <Radio
                                        value={option.optionWeightage.toString()}
                                      >
                                        {optionKey + 1}- {option.optionTitle}
                                      </Radio>
                                    </Box>
                                  );
                                })}
                              </RadioGroup>
                            </Box>
                            <Text
                              as="span"
                              _hover={{
                                color: "red",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleDeleteQuestions(question.questionsId)
                              }
                            >
                              Click to delete this question
                            </Text>
                          </>
                        );
                      })}
                    </Box>
                  );
                })}
            </Box>
          );
        })}
    </Container>
  );
};
