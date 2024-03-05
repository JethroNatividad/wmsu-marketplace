import { createCollection } from "@/firebase";

export interface UserData {
  completeSignUp: boolean;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  course: string;
  preferredCampus: string;
}

export const userRef = createCollection<UserData>("users");
