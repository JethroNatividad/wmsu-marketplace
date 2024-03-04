"use client";
// pages/verify.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import useUserState from "@/hooks/useUserState";

const VerifyEmail = () => {
  const { user, loading, errorUser, userData } = useUserState();
  const router = useRouter();

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (user) {
        // Check if the user's email is verified
        if (user.emailVerified) {
          // Check if user has completed sign up, (added name, etc.)
          // Redirect to completeSignUp if not
          if (!userData?.completeSignUp) {
            return router.push("/completeSignUp");
          } else {
            return router.push("/");
          }
        } else {
          // Send a verification email
          sendEmailVerification(user);
        }
      }
    };

    if (!loading && !errorUser) {
      checkEmailVerification();
    }
  }, [user, loading, errorUser, userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return router.push("/signIn");
  }

  return (
    <div>
      <div>
        <p>
          Please verify your email. A verification email has been sent to your
          email address. Reload this page after verifying your email.
        </p>
        <button onClick={() => sendEmailVerification(user)}>
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
