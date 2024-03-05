"use client";

import Layout from "@/components/Layout";
import PageLoading from "@/components/PageLoading";
import useUserState from "@/hooks/useUserState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { user, userData, loading, error } = useUserState();
  const router = useRouter();

  useEffect(() => {
    // - Not logged in ? redirect to /signIn : continue
    // - user not yet verified ? redirect to /verifyEmail: continue
    // - User not yetcompleteSignUp ? redirect to /completeSignUp  : continue
    if (!loading && !error) {
      if (!user || !userData) {
        return router.push("/signIn");
      }

      if (!user.emailVerified) {
        return router.push("/verifyEmail");
      }

      if (!userData.completeSignUp) {
        return router.push("/completeSignUp");
      }
    }
  }, [user, loading, error, userData]);

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
