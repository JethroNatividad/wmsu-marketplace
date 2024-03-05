"use client";

import Layout from "@/components/Layout";
import useUserState from "@/hooks/useUserState";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ManageListing = () => {
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
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <main className="p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Listings</h1>
          <Link href="/manageListing/createItem" className="btn btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export default ManageListing;
