import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import error from "next/error";

export type UserData = {
  completeSignUp: boolean;
  firstName: string;
  middleName?: string;
  lastName: string;
  department: string;
  preferredCampus?: string;
  profilePicture?: string;
  bio?: string;
};

const useUserState = () => {
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDataSnapshot = await getDoc(userRef);
          if (userDataSnapshot.exists()) {
            const data = userDataSnapshot.data() as UserData;
            setUserData({
              completeSignUp: data.completeSignUp || false,
              firstName: data.firstName || "",
              middleName: data.middleName || "",
              lastName: data.lastName || "",
              department: data.department || "",
              preferredCampus: data.preferredCampus || "",
              profilePicture: data.profilePicture || "",
              bio: data.bio || "",
            });
            setLoading(false);
          } else {
            console.error("User data not found");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError(error as Error);
        }
      }
    };

    if (!loadingUser && !errorUser) {
      fetchUserData();
    }
  }, [user]);

  return { user, userData, loading, error };
};

export default useUserState;
