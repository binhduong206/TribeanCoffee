export interface Product {
  id: string;
  mainImgUrl: string;
  productName: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  categoryName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
