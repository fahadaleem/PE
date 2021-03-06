import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Login } from "../components";
import { useAuth } from "../store";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated]);
  return <h1>Hello</h1>;
};

export default Home;
