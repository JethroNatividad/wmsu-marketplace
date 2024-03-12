"use client";

import React, { createContext, useState } from "react";

type AuthContextType = {};

const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
