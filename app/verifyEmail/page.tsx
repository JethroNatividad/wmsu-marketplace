"use client";
// pages/verify.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const VerifyEmail = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // - Not logged in ? redirect to /signIn : continue
    // - user already verified ? redirect to /completeSignUp : continue
    if (!loading && !error) {
      if (!user) {
        return router.push("/signIn");
      }
      if (user.emailVerified) {
        return router.push("/completeSignUp");
      }
    }
  }, [user, loading, error]);

  const handleSendEmailVerification = () => {
    if (user) {
      sendEmailVerification(user);
    }
  };

  return (
    <div>
      <div>
        <p>Verify Email</p>
        <button onClick={handleSendEmailVerification}>
          Send Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
