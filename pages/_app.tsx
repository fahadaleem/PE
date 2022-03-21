import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";
import { Login, Layout } from "../components";
import { useAuth } from "../store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const router = useRouter();

  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    setUserAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <ChakraProvider theme={theme}>
      {userAuthenticated ? (
        <>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </>
      ) : (
        <Login />
      )}
    </ChakraProvider>
  );
}

export default MyApp;
