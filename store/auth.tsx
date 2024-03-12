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
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

const AuthContext = createContext<AuthContextType>({
  userData: null,
  user: null,
  loading: true,
  error: null,
  setUserData: () => {},
});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errorUserData, setErrorUserData] = useState<Error | null>(null);

  const fetchUserData = async (user: User): Promise<UserData | null> => {
    try {
      const userDataSnapshot = await getDoc(userRef(user.uid));
      if (userDataSnapshot.exists()) {
        return userDataSnapshot.data() as UserData;
      } else {
        console.error("User data not found");
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const fn = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserData(user);
        if (!data) {
          setLoading(false);
          return;
        }
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorUserData(error as Error);
        setLoading(false);
      }
    };

    if (!loadingUser && !errorUser) {
      fn();
    }
  }, [user, loadingUser, errorUser]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        user,
        loading: loading,
        error: errorUserData || errorUser,
        setUserData,
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
