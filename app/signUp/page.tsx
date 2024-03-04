"use client";

import { auth } from "../../firebase";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const SignUp = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  if (!user) return <div>You must be signed in to complete the sign-up.</div>;

  return <div>Sign-up form goes here, welcome {user.email}</div>;
};

export default SignUp;
