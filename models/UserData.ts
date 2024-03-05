import { createCollection } from "@/firebase";
import { doc } from "firebase/firestore";

export interface UserData {
  completeSignUp: boolean;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  course: string;
  preferredCampus: string;
}

export const usersRef = createCollection<UserData>("users");

export const userRef = (uid: string) => doc(usersRef, uid);
