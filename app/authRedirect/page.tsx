"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import { signInWithEmailLink } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      const email = window.localStorage.getItem("emailForSignIn");
      if (!email) return;

      try {
        await signInWithEmailLink(auth, email, window.location.href);
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userData = await getDoc(userRef);
          if (!userData.exists || !userData.data()?.doneSignUp) {
            router.push("/signUp");
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error during sign-in", error);
      }
    };

    completeSignIn();
  }, []);

  return <div>Checking your sign-in status...</div>;
};

export default AuthRedirect;
