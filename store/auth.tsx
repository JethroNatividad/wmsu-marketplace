"use client";

import { auth } from "@/firebase";
import { UserData, userRef } from "@/models/User";
import { User } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import React, { createContext, useState } from "react";
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errorUserData, setErrorUserData] = useState<Error | null>(null);
  const [user, _, errorUser] = useAuthState(auth, {
    onUserChanged: async (user) => {
      try {
        setLoading(true);
        if (!user) {
          setLoading(false);
          return;
        }
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
    },
  });

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
