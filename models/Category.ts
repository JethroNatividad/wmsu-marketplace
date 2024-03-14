import { createCollection } from "@/firebase";

export interface Category {
  name: string;
  description: string;
  key: string;
}

export interface CategoryWithId extends Category {
  id: string;
}

export const categoriesRef = createCollection<Category>("categories");
