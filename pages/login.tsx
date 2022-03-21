import { useRouter } from "next/router";
import { useEffect } from "react";
import { Login } from "../components";
import { useAuth } from "../store";

const LoginIndex = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated]);
  return <Login />;
};

export default LoginIndex;
