import { CategoryWithId, categoriesRef } from "@/models/Category";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCategory = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<CategoryWithId[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(categoriesRef);
        const response = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(response);

        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { loading, error, categories };
};

export default useCategory;
