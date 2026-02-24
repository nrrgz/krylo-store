import * as React from 'react';
import { ProductCard, type ProductCardProps } from './ProductCard';

export interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  products: ProductCardProps[];
}

export function ProductGrid({ products, className = '', ...props }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500">
        <p className="text-lg font-medium">No products found.</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      {...props}
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
