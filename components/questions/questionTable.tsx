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
} from "@chakra-ui/react";
import axios from "axios";
import { INSPECT_MAX_BYTES } from "buffer";
import { useEffect, useState } from "react";
export const QuestionTable = () => {
  const [questions, setQuestions] = useState([]);

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
            <Box>
              <Heading size="md">{item.sectionTitle}</Heading>
              {item.questions.map((question, quekey) => {
                return (
                  <HStack spacing={4} border="1px solid gray" p={4} my={6}>
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
                              <Radio value={option.optionWeightage.toString()}>
                                {optionKey + 1}- Got caught by the unexpected
                                appeared to be controlled by events. Set vague
                                or unrealistic gaols
                              </Radio>
                            </Box>
                          );
                        })}
                      </HStack>
                    </RadioGroup>
                  </HStack>
                );
              })}
            </Box>
          );
        })}
    </Container>
  );
};
