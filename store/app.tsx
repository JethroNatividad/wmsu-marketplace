"use client";

import useCampus from "@/hooks/useCampus";
import useCategory from "@/hooks/useCategory";
import useCourse from "@/hooks/useCourse";
import { CampusWithId } from "@/models/Campus";
import { CategoryWithId } from "@/models/Category";
import { CourseWithId } from "@/models/Course";
import { createContext, useContext } from "react";

type AppContextType = {
  campuses: CampusWithId[];
  campusesLoading: boolean;
  campusesError: Error | null;
  categories: CategoryWithId[];
  categoriesLoading: boolean;
  categoriesError: Error | null;
  courses: CourseWithId[];
  coursesLoading: boolean;
  coursesError: Error | null;
};

const AppContext = createContext<AppContextType>({
  campuses: [],
  campusesLoading: true,
  campusesError: null,
  categories: [],
  categoriesLoading: true,
  categoriesError: null,
  courses: [],
  coursesLoading: true,
  coursesError: null,
});

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const { campuses, campusesLoading, campusesError } = useCampus();
  const { categories, categoriesLoading, categoriesError } = useCategory();
  const { courses, coursesLoading, coursesError } = useCourse();

  return (
    <AppContext.Provider
      value={{
        campuses,
        campusesLoading,
        campusesError,
        categories,
        categoriesError,
        categoriesLoading,
        courses,
        coursesError,
        coursesLoading,
      }}
    >
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
