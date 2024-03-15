import { CourseWithId, coursesRef } from "@/models/Course";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCourse = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [courses, setCourses] = useState<CourseWithId[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(coursesRef);
        const response = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCourses(response);

        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { loading, error, courses };
};

export default useCourse;
