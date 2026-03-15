import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

import type { Category } from '../../../types';
import type { ProductSort } from '../../../lib/catalogUtils';

export interface FiltersBarProps {
  categories: Category[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  sort: ProductSort;
  onSortChange: (value: ProductSort) => void;
  inStock: boolean;
  onInStockChange: (value: boolean) => void;
  onClear: () => void;
}

export function FiltersBar({
  categories,
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
  inStock,
  onInStockChange,
  onClear,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-4 bg-gray-50 border border-gray-100 rounded-lg p-4 sm:p-5 mb-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-sm h-8">
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Min/Max Price */}
        <div className="flex flex-col sm:flex-row gap-2 col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <Input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Sort */}
        <div>
          <Select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ProductSort)}
          >
            <option value="featured">Featured</option>`r`n            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="inStockCheck"
          checked={inStock}
          onChange={(e) => onInStockChange(e.target.checked)}
          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-4 h-4"
        />
        <label htmlFor="inStockCheck" className="text-sm text-gray-700 cursor-pointer select-none">
          In stock only
        </label>
      </div>
    </div>
  );
}

