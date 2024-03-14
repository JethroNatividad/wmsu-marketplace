import { createCollection } from "@/firebase";

export interface Category {
  name: string;
  description: string;
}

export const categoriesRef = createCollection<Category>("categories");
