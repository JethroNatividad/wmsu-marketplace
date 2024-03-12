"use client";

import { auth } from "@/firebase";
import { UserData, userRef } from "@/models/User";
import { User } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type AuthContextType = {
  userData: UserData | null;
  user: User | null | undefined;
  loading: boolean;
  error: Error | null | undefined;
};

const AuthContext = createContext<AuthContextType>({
  userData: null,
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errorUserData, setErrorUserData] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDataSnapshot = await getDoc(userRef(user.uid));
          if (userDataSnapshot.exists()) {
            const data = userDataSnapshot.data() as UserData;
            setUserData({
              completeSignUp: data.completeSignUp,
              firstName: data.firstName,
              middleName: data.middleName,
              lastName: data.lastName,
              course: data.course,
              preferredCampus: data.preferredCampus,
              email: data.email || user.email || "",
            });
            setLoading(false);
          } else {
            console.error("User data not found");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setErrorUserData(error as Error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (!loadingUser && !errorUser) {
      fetchUserData();
    }
  }, [user, loadingUser, errorUser]);

  // Don't run in "/signIn, /signUp, /verifyEmail, /completeSignUp"
  //   useEffect(() => {
  //     // Check if the current route is one of the specified ones
  //     const excludedRoutes = [
  //       "/signIn",
  //       "/signUp",
  //       "/verifyEmail",
  //       "/completeSignUp",
  //     ];
  //     if (excludedRoutes.includes(pathname)) {
  //       // If it is, exit the useEffect hook early
  //       return;
  //     }
  //     // - Not logged in ? redirect to /signIn : continue
  //     // - user not yet verified ? redirect to /verifyEmail: continue
  //     // - User not yetcompleteSignUp ? redirect to /completeSignUp  : continue
  //     if (!loading && !error) {
  //       if (!user || !userData) {
  //         return router.push("/signIn");
  //       }

  //       if (!user.emailVerified) {
  //         return router.push("/verifyEmail");
  //       }

  //       if (!userData.completeSignUp) {
  //         return router.push("/completeSignUp");
  //       }
  //     }

  //     console.log("user", user);
  //     console.log("userData", userData);
  //     console.log("loading", loading);
  //   }, [user, loading, error, userData, pathname]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        user,
        loading: loading,
        error: errorUserData || errorUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
