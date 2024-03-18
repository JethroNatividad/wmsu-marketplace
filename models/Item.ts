import { Campus } from "./Campus";
import { Category } from "./Category";
import { UserData } from "./User";

export interface Item {
  sellerId: string;
  itemName: string;
  price: number;
  discount?: number;
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
