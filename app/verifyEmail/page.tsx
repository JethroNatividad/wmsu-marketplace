"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import authHeroImage from "@/assets/images/auth-hero.png";
import Image from "next/image";
import PageLoading from "@/components/PageLoading";

const VerifyEmail = () => {
  const [user, loading, error] = useAuthState(auth);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
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

  const handleSendEmailVerification = async () => {
    if (user) {
      setSending(true);
      await sendEmailVerification(user);
      setSending(false);
      setSent(true);
    }
  };

  if (loading || !user || user.emailVerified) {
    return <PageLoading />;
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
            Refresh this page after verifying your email.
          </p>
          <button
            className="btn btn-primary w-full"
            disabled={sending}
            onClick={handleSendEmailVerification}
          >
            {sending
              ? "Sending"
              : sent
              ? "Resend Verification Email"
              : "Send Verification Email"}

            {sending && <span className="loading loading-spinner"></span>}
            {!sending && sent && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
