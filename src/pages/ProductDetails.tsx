import { useState } from 'react';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RatingStars } from '../components/ui/RatingStars';
import { ProductGrid } from '../features/catalog/components/ProductGrid';
import type { Product } from '../types';

// Mock Product Data
const MOCK_PRODUCT: Product = {
  id: 'p1',
  name: 'Krylo Pro Mechanical Keyboard',
  brand: 'Krylo',
  description: 'Experience precision typing with the Krylo Pro. Featuring custom hot-swappable tactile switches, an aerospace-grade aluminum chassis, and double-shot PBT keycaps. Designed for both professional developers and typing enthusiasts seeking the ultimate acoustic and tactile feedback.',
  category: 'keyboards',
  price: 149.99,
  rating: 4.8,
  reviewCount: 342,
  images: ['', '', '', ''], // 4 mock images
  colors: [
    { name: 'Matte Black', hex: '#1C1C1C' },
    { name: 'Chalk White', hex: '#F5F5F5' },
    { name: 'Ocean Blue', hex: '#1D3B55' },
  ],
  tags: ['mechanical', 'wireless', 'hot-swappable'],
  isFeatured: true,
  createdAt: new Date().toISOString(),
  stockByColor: {
    'Matte Black': 15,
    'Chalk White': 0,
    'Ocean Blue': 5,
  }
};

const MOCK_RELATED = [
  { id: '2', name: 'Krylo Precision Mouse', brand: 'Krylo', price: 89.99, rating: 4.5, image: '', category: 'mice' },
  { id: '4', name: 'Merino Wool Desk Mat', brand: 'Krylo', price: 59.99, rating: 4.7, image: '', category: 'desk' },
  { id: '6', name: 'Braided USB-C Cable 2m', brand: 'Krylo', price: 19.99, rating: 4.4, image: '', category: 'cables' },
  { id: '11', name: 'Magnetic Cable Organizer', brand: 'Krylo', price: 24.99, rating: 4.5, image: '', category: 'desk' },
];

export function ProductDetails() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.colors[0].name);
  const [quantity, setQuantity] = useState(1);

  const stockAvailable = MOCK_PRODUCT.stockByColor[selectedColor] || 0;
  const isOutOfStock = stockAvailable === 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      return Math.max(1, Math.min(newQty, stockAvailable));
    });
  };

  const handleAddToCart = () => {
    console.log(`Adding ${quantity} of ${selectedColor} to cart`);
    // Placeholder handler
  };

  return (
    <div className="container-base py-12">
      {/* Product Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24">

        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-medium">
            Main Image Placeholder
          </div>
          <div className="grid grid-cols-4 gap-4">
            {MOCK_PRODUCT.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium border-2 transition-all ${selectedImageIndex === idx ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
                  }`}
              >
                Thumb {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
              {MOCK_PRODUCT.brand}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              {MOCK_PRODUCT.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                ${MOCK_PRODUCT.price.toFixed(2)}
              </span>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2">
                <RatingStars rating={MOCK_PRODUCT.rating} />
                <span className="text-sm font-medium text-gray-600">
                  {MOCK_PRODUCT.rating.toFixed(1)} ({MOCK_PRODUCT.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            {MOCK_PRODUCT.description}
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            {MOCK_PRODUCT.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="font-medium text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Color Selector */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-900">Color</span>
              <span className="text-sm text-gray-500">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-3">
              {MOCK_PRODUCT.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                const isColorOutOfStock = (MOCK_PRODUCT.stockByColor[color.name] || 0) === 0;

                return (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setQuantity(1); // reset quantity on color change
                    }}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSelected ? 'ring-2 ring-gray-900 ring-offset-2' : 'ring-1 ring-gray-200 hover:ring-gray-400'
                      } ${isColorOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={`${color.name}${isColorOutOfStock ? ' (Out of stock)' : ''}`}
                  >
                    <span
                      className="w-8 h-8 rounded-full shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isColorOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-gray-900 transform -rotate-45" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center border border-gray-200 rounded-md bg-white">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                &minus;
              </button>
              <div className="w-12 h-12 flex items-center justify-center font-semibold text-gray-900 text-sm">
                {quantity}
              </div>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= stockAvailable || isOutOfStock}
                className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                &#43;
              </button>
            </div>

            <Button
              size="lg"
              className="flex-grow text-base h-12 bg-gray-900 hover:bg-gray-800"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart — $' + (MOCK_PRODUCT.price * quantity).toFixed(2)}
            </Button>
          </div>

          <div className="text-sm text-gray-500 italic">
            {isOutOfStock ? 'This item is currently unavailable in the selected color.' :
              stockAvailable < 5 ? `Only ${stockAvailable} left in stock - order soon.` : 'In stock and ready to ship.'}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="pt-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
          Complete Your Setup
        </h2>
        <ProductGrid products={MOCK_RELATED} />
      </div>
    </div>
  );
}
