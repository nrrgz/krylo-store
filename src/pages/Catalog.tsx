import { useState } from 'react';
import { ProductGrid } from '../features/catalog/components/ProductGrid';
import { FiltersBar } from '../features/catalog/components/FiltersBar';
import { Pagination } from '../features/catalog/components/Pagination';

const mockedProducts = [
  { id: '1', name: 'Krylo Pro Mechanical Keyboard', brand: 'Krylo', price: 149.99, rating: 4.8, image: '', category: 'keyboards', badgeText: 'Best Seller' },
  { id: '2', name: 'Krylo Precision Mouse', brand: 'Krylo', price: 89.99, rating: 4.5, image: '', category: 'mice' },
  { id: '3', name: 'SoundScape ANC Headphones', brand: 'AudioTech', price: 249.99, rating: 4.9, image: '', category: 'audio', badgeText: 'New' },
  { id: '4', name: 'Merino Wool Desk Mat', brand: 'Krylo', price: 59.99, rating: 4.7, image: '', category: 'desk' },
  { id: '5', name: 'GaN 100W Charger', brand: 'PowerUP', price: 49.99, rating: 4.6, image: '', category: 'charging' },
  { id: '6', name: 'Braided USB-C Cable 2m', brand: 'Krylo', price: 19.99, rating: 4.4, image: '', category: 'cables' },
  { id: '7', name: 'Ergo Split Keyboard', brand: 'ErgoGear', price: 199.99, rating: 4.3, image: '', category: 'keyboards' },
  { id: '8', name: 'Wireless Charging Stand', brand: 'PowerUP', price: 39.99, rating: 4.2, image: '', category: 'charging' },
  { id: '9', name: 'Monitor Light Bar', brand: 'Lumina', price: 79.99, rating: 4.8, image: '', category: 'desk' },
  { id: '10', name: 'Studio Microphone', brand: 'AudioTech', price: 129.99, rating: 4.6, image: '', category: 'audio' },
  { id: '11', name: 'Magnetic Cable Organizer', brand: 'Krylo', price: 24.99, rating: 4.5, image: '', category: 'desk' },
  { id: '12', name: 'Ultra-light Gaming Mouse', brand: 'Krylo', price: 99.99, rating: 4.7, image: '', category: 'mice' },
];

export function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('featured');
  const [inStock, setInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleClear = () => {
    setSearchTerm('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('featured');
    setInStock(false);
    setCurrentPage(1);
  };

  return (
    <div className="container-base py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Shop All Products</h1>
        <p className="text-gray-500">Discover our curated collection of premium tech accessories.</p>
      </div>

      <FiltersBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        sort={sort}
        onSortChange={setSort}
        inStock={inStock}
        onInStockChange={setInStock}
        onClear={handleClear}
      />

      <div className="mb-4 text-sm text-gray-500">
        Showing {mockedProducts.length} products
      </div>

      <ProductGrid products={mockedProducts} />

      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
