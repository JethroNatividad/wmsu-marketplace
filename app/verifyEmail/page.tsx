"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import authHeroImage from "@/assets/images/auth-hero.png";
import Image from "next/image";

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

  if (loading || !user || user.emailVerified) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block w-1/2 h-full relative overflow-hidden">
        <Image className="object-cover" fill src={authHeroImage} alt="hero" />
      </div>
      <div className="w-full lg:w-1/2 h-full flex lg:items-center justify-center">
        <div className="w-full max-w-lg px-5 py-10 lg:py-0 space-y-3">
          <h1 className="text-4xl font-bold">Verify Your Email</h1>
          <p>
            Account Created Successfully. Please verify your email to continue.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleSendEmailVerification}
          >
            Send Verification Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
