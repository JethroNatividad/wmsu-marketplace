import { createCollection } from "@/firebase";

export interface Campus {
  name: string;
  key: string;
}

export interface CampusWithId extends Campus {
  id: string;
}

export const campusesRef = createCollection<Campus>("campuses");
