// hooks/useAuthRedirect.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

const useAuthRedirect = () => {
  const { loading, error, user, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !error) {
      if (!user || !userData) {
        router.push("/signIn");
        return;
      }

      if (!user.emailVerified) {
        router.push("/verifyEmail");
        return;
      }

      if (!userData.completeSignUp) {
        router.push("/completeSignUp");
        return;
      }
    }
  }, [user, userData, loading, error, router]);
};

export default useAuthRedirect;
