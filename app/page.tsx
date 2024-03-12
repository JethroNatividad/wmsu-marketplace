"use client";

import Layout from "@/components/Layout";
import PageLoading from "@/components/PageLoading";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useAuth } from "@/store/auth";

const Home = () => {
  const { loading, userData, user } = useAuth();

  useAuthRedirect();
  if (loading || !userData?.completeSignUp || !user?.emailVerified) {
    return <PageLoading />;
  }

  return (
    <Layout>
      <main className="p-5">
        <h1>
          Hello, {userData?.firstName} {userData?.middleName}{" "}
          {userData?.lastName}
        </h1>
        <p>Email: {userData?.email}</p>
        <p>Course: {userData?.course}</p>
        <p>Preferred Campus: {userData?.preferredCampus}</p>
      </main>
    </Layout>
  );
};

export default Home;
