import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Textarea,
  useColorModeValue,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";

interface ISections {
  data: {
    status: string;
    sections: ISection[];
  };
}

interface ISection {
  sectionid: number;
  sectiontitle: string;
  sectiondescription: string;
}

export const AddQuestionForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "optionsAndWeightage",
    }
  );

  const [formSections, setFormSections] = useState<ISection[]>();

  const handleGetSections = async () => {
    try {
      const sections: ISections = await axios.get("/api/sections");
      setFormSections(sections.data.sections);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetSections();
  }, []);

  return (
    <Container maxW="container.lg">
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
        my={10}
      >
        <Heading my={4}>Add New Questions</Heading>
        <form
          onSubmit={handleSubmit(async (data) => {
            console.log(data.questionDescription.replace("'", "''"));
            const resp = await axios.post("/api/questions", {
              questionDescription: data.questionDescription.replace("'", "''"),
              questionTitle: data.questionTitle.replace("'", "''"),
              sectionId: data.section,
              options: data.optionsAndWeightage,
            });
            if (resp.data.status === "success") {
              alert("New question added");
              reset();
            }
          })}
        >
          <VStack spacing={4} alignItems="flex-start">
            {formSections && (
              <FormControl>
                <FormLabel>Select Section</FormLabel>
                <Select
                  {...register("section", {
                    required: "Select Section",
                  })}
                >
                  <option>Select Section</option>
                  {formSections.map((item: ISection) => (
                    <option value={item.sectionid} key={item.sectionid}>
                      {item.sectiontitle}
                    </option>
                  ))}
                </Select>
                {errors?.section?.type === "required" && (
                  <FormLabel color="brand.error" my="2">
                    Please select section
                  </FormLabel>
                )}
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Question Title</FormLabel>
              <Input
                type="text"
                placeholder="Enter question title"
                {...register("questionTitle", {
                  required: "Please enter question title.",
                })}
              />
              {console.log(errors)}
              {errors?.questionTitle?.type === "required" && (
                <FormLabel color="brand.error" my="2">
                  Please enter question title
                </FormLabel>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Question Description</FormLabel>
              <Textarea
                placeholder="Enter question Description"
                {...register("questionDescription", {
                  required: "Please enter question description.",
                })}
              />
              {errors?.questionDescription?.type === "required" && (
                <FormLabel color="brand.error" my="2">
                  Please enter question description
                </FormLabel>
              )}
            </FormControl>
            {fields.length && <Heading>Add Options</Heading>}
            {fields.map((field, index) => (
              <HStack width="100%" spacing={8} key={index}>
                <FormControl>
                  <FormLabel>Option Title</FormLabel>
                  <Input
                    type="text"
                    {...register(`optionsAndWeightage.${index}.optionTitle`, {
                      required: true,
                    })}
                    placeholder="Enter title of option"
                  />
                  {errors.optionsAndWeightage && (
                    <>
                      {errors?.optionsAndWeightage[index]?.optionTitle?.type ===
                        "required" && (
                        <FormLabel color="brand.error" my="2">
                          Please enter option title
                        </FormLabel>
                      )}
                    </>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Weightage:</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter option weightage"
                    {...register(
                      `optionsAndWeightage.${index}.optionWeightage`,
                      {
                        required: true,
                        min: {
                          value: 0,
                          message: "Value should not be less than 0",
                        },
                        max: {
                          value: 15,
                          message: "Value should not be greater than 15",
                        },
                      }
                    )}
                  />
                  {errors.optionsAndWeightage && (
                    <>
                      {errors?.optionsAndWeightage[index]?.optionWeightage
                        ?.type === "required" && (
                        <FormLabel color="brand.error" my="2">
                          Please enter option Weigtage
                        </FormLabel>
                      )}
                      {errors?.optionsAndWeightage[index]?.optionWeightage
                        ?.type === "max" && (
                        <FormLabel color="brand.error" my="2">
                          {
                            errors?.optionsAndWeightage[index]?.optionWeightage
                              .message
                          }
                        </FormLabel>
                      )}
                      {errors?.optionsAndWeightage[index]?.optionWeightage
                        ?.type === "min" && (
                        <FormLabel color="brand.error" my="2">
                          {
                            errors?.optionsAndWeightage[index]?.optionWeightage
                              .message
                          }
                        </FormLabel>
                      )}
                    </>
                  )}
                </FormControl>
              </HStack>
            ))}
            <FormControl>
              <Text
                color="brand.primary"
                cursor="pointer"
                onClick={() =>
                  append({
                    optionTitle: "",
                    optionWeightage: "",
                  })
                }
              >
                Click to add options
              </Text>
            </FormControl>
            <FormControl>
              <Button bg="brand.primary" color="white" px={14} type="submit">
                Submit
              </Button>
            </FormControl>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};
