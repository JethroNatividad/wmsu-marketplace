import { UserInfo } from "firebase/auth";

// Item:
// seller: sellerId
// Item name: string
// price: number
// discount: number
// category:
// condition: New, used - like new, used - good, used - fair
// Description: string
// campus: Main Campus A, Main Campus B
// tags: [string]

export interface Item {
  seller: string;
  itemName: string;
  price: number;
  discount?: number;
  category: string;
  condition: string;
  description: string;
  campus: string;
  tags: string[];
  images: string[];
}
