import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  HStack,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../../backend";
import axios from "axios";
import { useAuth } from "../../store";
import { useState } from "react";

interface ILoginAuth {
  email: string;
  password: string;
}

interface IErrorAlert {
  message: string;
  onClose: () => void;
}

const ErrorAlert = ({ message, onClose }: IErrorAlert) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle mr={2}>Error!</AlertTitle>
      <AlertDescription>{message}.</AlertDescription>
      <CloseButton
        onClick={onClose}
        position="absolute"
        right="8px"
        top="8px"
      />
    </Alert>
  );
};

export const Login = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<ILoginAuth>();

  const setAuth = useAuth((state) => state.setAuth);
  const [error, setError] = useState(null);

  const handleLogin = async (data: ILoginAuth) => {
    try {
      const resp = await axios.post(`/api/auth`, data);
      if (resp.data.status === "success") {
        setAuth(resp.data.user);
      }
    } catch (error: any) {
      // alert
      setError(error?.response.data.message);
    }
  };

  return (
    <>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <Box
        minH="100vh"
        d="flex"
        flexDirection="column"
        justifyContent="center"
        maxW="500px"
        mx="auto"
      >
        <Heading fontSize={"4xl"} color="brand.primary" textAlign="center">
          Sign in to your account{" "}
        </Heading>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Stack spacing={4} my={6}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                {...register("email", {
                  required: "Please enter your email",
                })}
                borderColor="brand.fieldBorder"
                _focus={{
                  borderColor: "#000",
                  boxShadow: "0 0 0 1px #000",
                }}
              />
              {errors.email?.type === "required" && (
                <FormLabel mt={2} color="red">
                  {errors.email.message}
                </FormLabel>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "Please enter your password",
                })}
                _focus={{
                  borderColor: "#000",
                  boxShadow: "0 0 0 1px #000",
                }}
              />
              {errors.password?.type === "required" && (
                <FormLabel mt={2} color="red">
                  {errors.password.message}
                </FormLabel>
              )}
            </FormControl>
            <Button
              bg={"brand.primary"}
              color={"white"}
              _hover={{
                bg: "brand.secondary",
              }}
              type="submit"
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
};
