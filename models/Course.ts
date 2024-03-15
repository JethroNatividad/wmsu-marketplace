import { createCollection } from "@/firebase";

export interface Course {
  name: string;
  code: string;
  key: string;
}

export interface CourseWithId extends Course {
  id: string;
}

export const coursesRef = createCollection<Course>("courses");
