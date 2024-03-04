// pages/verify.tsx
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/router";
import { sendEmailVerification } from "firebase/auth";

const VerifyEmail = () => {
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (user) {
        // Check if the user's email is verified
        if (user.emailVerified) {
          // Redirect to the home page or another appropriate page
          router.push("/");
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
          email address.
        </p>
        <button onClick={() => sendEmailVerification(user)}>
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
