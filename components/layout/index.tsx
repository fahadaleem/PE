import { Navbar } from "./navbar";
import { Box } from "@chakra-ui/react";
import { Login } from "../login";
import { useRouter } from "next/router";
import { useAuth } from "../../store";

export const Layout = ({ children }: any) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const router = useRouter();

  return (
    <>
      <Box>
        <Navbar />
        {children}
      </Box>
    </>
  );
};
