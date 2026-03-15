import type { Product } from '../types';

export type ProductSort = "featured" | "newest" | "price_asc" | "price_desc" | "rating_desc";

export const isValidSort = (value: string | null): value is ProductSort => {
  return ["featured", "newest", "price_asc", "price_desc", "rating_desc"].includes(value as ProductSort);
};

export interface ProductQueryParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sort?: ProductSort;
  page: number;
  pageSize: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export function applyFiltersSortPaginate(
  products: Product[],
  params: ProductQueryParams
): PaginatedProducts {
  let filtered = [...products];

  // Filters
  if (params.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  if (params.category) {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  if (params.minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= params.minRating!);
  }

  if (params.inStockOnly) {
    filtered = filtered.filter((p) => {
      // Product is in stock if any color has stock > 0
      return Object.values(p.stockByColor).some((stock) => stock > 0);
    });
  }

  // Sorting
  if (params.sort) {
    switch (params.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  // Pagination
  const total = filtered.length;
  // If no pagination provided, default to keeping it safe
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filtered.slice(startIndex, endIndex);

  return {
    items,
    total,
    page,
    pageSize,
  };
}
