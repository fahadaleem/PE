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
  ButtonGroup,
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
  section_id: number;
  section_title: string;
  is_expanded: boolean;
}

export const AddQuestionForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "optionsAndWeightage",
    }
  );

  const watchMainSections = watch("mainSection");
  const [mainSection, setMainSection] = useState("");

  useEffect(() => {
    handleGetSubSections(mainSection);
    reset();
  }, [mainSection]);

  const [formSections, setFormSections] = useState<ISection[]>();
  const [subSections, setSubSections] = useState([]);
  const handleGetSections = async () => {
    try {
      const sections: ISections = await axios.get("/api/mainSections");
      setFormSections(sections.data.sections);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSubSections = async (mainSecId: number) => {
    try {
      const sections = await axios.get(`/api/subSections/${mainSecId}`);
      setSubSections(sections.data.sections);
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
            console.log({
              questionDescription: data.questionDescription.replace("'", "''"),
              questionTitle: data.questionTitle.replace("'", "''"),
              mainSection: mainSection,
              options: data.optionsAndWeightage,
              subSection: data.subSection,
              ...(formSections?.filter((item) => item.section_id == mainSection)[0]?
                .is_expanded && {subSubSection:data.subSubSection})
            });
            const resp = await axios.post("/api/questions", {
              questionDescription: data.questionDescription.replace("'", "''"),
              questionTitle: data.questionTitle.replace("'", "''"),
              mainSection: mainSection,
              options: data.optionsAndWeightage,
              subSection: data.subSection,
              ...(formSections?.filter((item) => item.section_id == mainSection)[0]?
                .is_expanded && {subSubSection:data.subSubSection})
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
                <FormLabel>Select Main Section</FormLabel>
                <Select
                  // {...register("mainSection", {
                  //   required: "Select Section",
                  // })}
                  onChange={(e) => {
                    setMainSection(e.target.value);
                  }}
                  value={mainSection}
                >
                  <option value={""}>Select Section</option>
                  {formSections.map((item: ISection) => (
                    <option value={item.section_id} key={item.section_id}>
                      {item.section_title}
                    </option>
                  ))}
                </Select>
                {errors?.mainSection?.type === "required" && (
                  <FormLabel color="brand.error" my="2">
                    Please select section
                  </FormLabel>
                )}
              </FormControl>
            )}
            {mainSection && <>
              {subSections.length > 0 && (
              <FormControl>
                <FormLabel>Select Sub Section</FormLabel>
                <Select
                  {...register("subSection", {
                    required: "Select sub section",
                  })}
                >
                  <option >Select sub Section</option>
                  {subSections.map((item: ISection) => (
                    <option value={item.section_id} key={item.section_id}>
                      {item.section_title}
                    </option>
                  ))}
                </Select>
                {errors?.subSection?.type === "required" && (
                  <FormLabel color="brand.error" my="2">
                    Please select sub section
                  </FormLabel>
                )}
              </FormControl>
            )}
            {!isNaN(mainSection) &&
              formSections?.filter((item) => item.section_id == mainSection)[0]?
                .is_expanded && (
                <FormControl>
                  <FormLabel>Sub Sub Section</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter sub sub section"
                    {...register("subSubSection", {
                      required: "Please enter sub sub section.",
                    })}
                  />
                  {errors?.subSubSection?.type === "required" && (
                    <FormLabel color="brand.error" my="2">
                      Please enter sub sub section.
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
            {fields.length.length>0 && <Heading>Add Options</Heading>}
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
            </FormControl></>}
          </VStack>
        </form>
      </Box>
    </Container>
  );
};
