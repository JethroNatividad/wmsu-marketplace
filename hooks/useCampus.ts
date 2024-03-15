import { CampusWithId, campusesRef } from "@/models/Campus";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCampus = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [campuses, setCampuses] = useState<CampusWithId[]>([]);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const snapshot = await getDocs(campusesRef);
        const response = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCampuses(response);

        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchCampuses();
  }, []);

  return { loading, error, campuses };
};

export default useCampus;
