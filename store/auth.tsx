"use client";

import useUserState from "@/hooks/useUserState";
import { UserData } from "@/models/User";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect } from "react";

type AuthContextType = {
  userData: UserData | null;
  user: User | null | undefined;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  userData: null,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const { user, userData, loading, error } = useUserState();
  const router = useRouter();

  useEffect(() => {
    // - Not logged in ? redirect to /signIn : continue
    // - user not yet verified ? redirect to /verifyEmail: continue
    // - User not yetcompleteSignUp ? redirect to /completeSignUp  : continue
    if (!loading && !error) {
      if (!user || !userData) {
        return router.push("/signIn");
      }

      if (!user.emailVerified) {
        return router.push("/verifyEmail");
      }

      if (!userData.completeSignUp) {
        return router.push("/completeSignUp");
      }
    }

    console.log("user", user);
    console.log("userData", userData);
    console.log("loading", loading);
  }, [user, loading, error, userData]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        user,
        loading,
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
