import { Product } from "../entity/products.entity";

export interface PaginatedProducts {
    data: Product[];
    total: number;
    page: number;
    limit: number;
  }
  