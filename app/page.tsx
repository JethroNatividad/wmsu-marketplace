"use client";

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
  }, [user, loading, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>Hello, {userData?.firstName}</h1>
    </main>
  );
};

export default Home;
