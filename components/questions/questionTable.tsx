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
  sectionTitle: string;
  sectionDescription: string;
  questions: IQuestion[];
}

interface IQuestion {
  questionsId: number;
  questionTitle: string;
  questionDescription: string;
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
              <Heading size="md">{item.sectionTitle}</Heading>
              {item.questions.map((question, quekey) => {
                return (
                  <>
                    <HStack
                      spacing={4}
                      border="1px solid gray"
                      p={4}
                      my={3}
                      key={quekey}
                    >
                      <Box flex={2}>
                        <Heading size="md" fontWeight={600}>
                          {question.questionTitle}
                        </Heading>
                        <Text fontWeight={300}>
                          {question.questionDescription}
                        </Text>
                      </Box>

                      <RadioGroup flex={2}>
                        <HStack>
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
                        </HStack>
                      </RadioGroup>
                    </HStack>
                    {console.log(question)}
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
    </Container>
  );
};
