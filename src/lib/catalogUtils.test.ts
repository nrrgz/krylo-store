import { describe, expect, it } from 'vitest';
import { applyFiltersSortPaginate } from './catalogUtils';
import { products } from '../data/products';

describe('catalogUtils', () => {
  it('filters by query and category', () => {
    const result = applyFiltersSortPaginate(products, {
      query: 'krylo',
      category: 'keyboards',
      page: 1,
      pageSize: 50,
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((item) => item.category === 'keyboards')).toBe(true);
  });

  it('sorts newest first', () => {
    const result = applyFiltersSortPaginate(products, {
      sort: 'newest',
      page: 1,
      pageSize: 20,
    });

    const timestamps = result.items.map((item) => new Date(item.createdAt).getTime());
    const sorted = [...timestamps].sort((a, b) => b - a);

    expect(timestamps).toEqual(sorted);
  });

  it('paginates consistently', () => {
    const pageOne = applyFiltersSortPaginate(products, { page: 1, pageSize: 5 });
    const pageTwo = applyFiltersSortPaginate(products, { page: 2, pageSize: 5 });

    expect(pageOne.items).toHaveLength(5);
    expect(pageTwo.items).toHaveLength(5);
    expect(pageOne.items[0].id).not.toBe(pageTwo.items[0].id);
  });
});
