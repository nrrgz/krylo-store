import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProducts } from '../lib/api/catalogApi';
import { ProductGrid } from '../features/catalog/components/ProductGrid';
import { FiltersBar } from '../features/catalog/components/FiltersBar';
import { Pagination } from '../features/catalog/components/Pagination';
import { isValidSort, type ProductSort, type ProductQueryParams } from '../lib/catalogUtils';

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read params
  const searchTerm = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortParam = searchParams.get('sort');
  const sort: ProductSort = isValidSort(sortParam) ? sortParam : 'featured';
  const inStock = searchParams.get('inStock') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  // Prepare typed query for backend
  const queryParams: ProductQueryParams = {
    query: searchTerm || undefined,
    category: category || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
    inStockOnly: inStock,
    page,
    pageSize,
  };

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams),
  });

  const updateParam = (key: string, value: string | boolean | number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === '' || value === false || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
      if (key !== 'page') {
        newParams.set('page', '1');
      }
      return newParams;
    });
  };

  const handleClear = () => {
    setSearchParams({});
  };

  return (
    <div className="container-base py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Shop All Products</h1>
        <p className="text-gray-500">Discover our curated collection of premium tech accessories.</p>
      </div>

      <FiltersBar
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={(v) => updateParam('q', v)}
        category={category}
        onCategoryChange={(v) => updateParam('category', v)}
        minPrice={minPrice}
        onMinPriceChange={(v) => updateParam('minPrice', v)}
        maxPrice={maxPrice}
        onMaxPriceChange={(v) => updateParam('maxPrice', v)}
        sort={sort}
        onSortChange={(v) => updateParam('sort', v)}
        inStock={inStock}
        onInStockChange={(v) => updateParam('inStock', v)}
        onClear={handleClear}
      />

      {isError && (
        <div className="py-24 text-center text-red-500">
          <p className="text-lg font-medium">Failed to load products.</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-[var(--surface-2)] rounded-xl h-96 w-full shadow-sm" />
          ))}
        </div>
      ) : productsData ? (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {productsData.items.length} of {productsData.total} products
          </div>

          <ProductGrid products={productsData.items.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            rating: p.rating,
            image: p.images[0] || '',
            category: p.category,
            badgeText: p.isFeatured ? 'Featured' : undefined,
          }))} />

          {Math.ceil(productsData.total / pageSize) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(productsData.total / pageSize)}
              onPageChange={(p) => updateParam('page', p)}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
