export interface ProductDTO {
  id: string;
  name: string;
  name_bn: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  seller: string;
  location: string;
  rating: number;
  numReviews: number;
}

export interface CreateProductDTO {
  name: string;
  name_bn: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  stock: number;
  location: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}