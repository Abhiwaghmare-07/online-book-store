export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  price: number | string;
  category: string;
}
