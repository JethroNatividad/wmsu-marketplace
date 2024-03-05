"use client";

import useUserState from "@/hooks/useUserState";

const Home = () => {
  const { user, userData, loading, error } = useUserState();

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
