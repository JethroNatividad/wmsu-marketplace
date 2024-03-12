"use client";

import Layout from "@/components/Layout";
import PageLoading from "@/components/PageLoading";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useAuth } from "@/store/auth";
import Link from "next/link";

const ManageListing = () => {
  const { loading, userData, user } = useAuth();

  useAuthRedirect();
  if (loading || !userData?.completeSignUp || !user?.emailVerified) {
    return <PageLoading />;
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
