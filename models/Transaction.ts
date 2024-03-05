export interface Transaction {
  buyer: string;
  seller: string;
  item: string;
  messages: string[];
  completed: boolean;
  completed_date: Date;
}

export interface Message {
  author: string;
  content: string;
}
