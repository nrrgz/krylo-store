import { categories, products } from '../../data';
import type { Category, Product } from '../../types';
import { applyFiltersSortPaginate, type ProductQueryParams, type PaginatedProducts } from '../catalogUtils';
import { simulateDelay, maybeThrowError } from './apiClient';

export async function getCategories(): Promise<Category[]> {
  await simulateDelay();
  maybeThrowError();
  return categories;
}

export async function getProducts(params: ProductQueryParams): Promise<PaginatedProducts> {
  await simulateDelay();
  maybeThrowError();
  return applyFiltersSortPaginate(products, params);
}

export async function getProductById(id: string): Promise<Product | null> {
  await simulateDelay();
  maybeThrowError();
  const product = products.find((p) => p.id === id);
  return product || null;
}
