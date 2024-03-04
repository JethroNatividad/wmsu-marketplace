"use client";
// pages/verify.tsx
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const VerifyEmail = () => {
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (user) {
        // Check if the user's email is verified
        if (user.emailVerified) {
          // Check if user has completed sign up, (added name, etc.)
          // Redirect to completeSignUp if not
          const userRef = doc(db, "users", user.uid);
          const userData = await getDoc(userRef);
          if (!userData.exists || !userData.data()?.completeSignUp) {
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

    if (!loadingUser && !errorUser) {
      checkEmailVerification();
    }
  }, [user, loadingUser, errorUser]);

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (errorUser) {
    return <div>Error: {errorUser?.message}</div>;
  }

  if (!user) {
    return <div>Error: User not found</div>;
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
