import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import { UserData, userRef } from "@/models/User";

const useUserState = () => {
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [errorUserData, setErrorUserData] = useState<Error | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDataSnapshot = await getDoc(userRef(user.uid));
          if (userDataSnapshot.exists()) {
            const data = userDataSnapshot.data() as UserData;
            setUserData({
              completeSignUp: data.completeSignUp,
              firstName: data.firstName,
              middleName: data.middleName,
              lastName: data.lastName,
              course: data.course,
              preferredCampus: data.preferredCampus,
              email: data.email || user.email || "",
            });
            setLoading(false);
          } else {
            console.error("User data not found");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setErrorUserData(error as Error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (!loadingUser && !errorUser) {
      fetchUserData();
    }
  }, [user, loadingUser, errorUser]);

  return {
    user,
    userData,
    loading: loadingUser || loading,
    error: errorUserData || errorUser,
  };
};

export default useUserState;
