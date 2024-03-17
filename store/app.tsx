"use client";

import { createContext, useContext } from "react";

type AppContextType = {};

const AppContext = createContext<AppContextType>({});

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default AppContext;

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AuthProvider");
  }
  return context;
};
