import { useRouter } from "next/router";
import { useEffect } from "react";
import { AddQuestionForm } from "../components";
import { useAuth } from "../store";

const AddQuestions = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated]);
  return <AddQuestionForm />;
};

export default AddQuestions;
