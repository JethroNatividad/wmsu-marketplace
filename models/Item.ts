import { createCollection } from "@/firebase";
import { Campus } from "./Campus";
import { Category } from "./Category";
import { UserData } from "./User";
import { doc } from "firebase/firestore";

export interface Item {
  sellerId: string;
  itemName: string;
  price: number;
  discount: number;
  categoryId: string;
  condition: string;
  description: string;
  campusId: string;
  tags: string[];
  images: string[];
}

export interface ItemWithId extends Item {
  id: string;
}

export interface PopulatedItem extends ItemWithId {
  seller: Omit<UserData, "completeSignUp" | "email">;
  category: Category;
  campus: Campus;
}

export const itemsRef = createCollection<Item>("items");

export const itemRef = (uid: string) => doc(itemsRef, uid);
