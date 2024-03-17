"use client";

import useCampus from "@/hooks/useCampus";
import { CampusWithId } from "@/models/Campus";
import { createContext, useContext } from "react";

type AppContextType = {
  campuses: CampusWithId[];
  campusesLoading: boolean;
};

const AppContext = createContext<AppContextType>({
  campuses: [],
  campusesLoading: true,
});

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const { campuses, campusesLoading } = useCampus();
  return (
    <AppContext.Provider value={{ campuses, campusesLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AuthProvider");
  }
  return context;
};
