import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAppDispatch } from '../app/hooks';
import { addItem } from '../features/cart/cartSlice';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RatingStars } from '../components/ui/RatingStars';
import { ProductGrid } from '../features/catalog/components/ProductGrid';
import { getProductById, getProducts } from '../lib/api/catalogApi';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorState, setSelectedColorState] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Fetch product
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedData } = useQuery({
    queryKey: ['products', product?.category],
    queryFn: () => getProducts({ category: product?.category, page: 1, pageSize: 8 }),
    enabled: !!product?.category,
  });

  // Reset states when a new product loads
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedColorState(null);
      setQuantity(1);
    }
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="container-base py-24 flex justify-center items-center">
        <div className="animate-pulse w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-[var(--surface-2)] rounded-xl" />
          <div className="flex flex-col gap-4">
            <div className="h-4 bg-[var(--surface-2)] rounded w-1/4" />
            <div className="h-10 bg-[var(--surface-2)] rounded w-3/4" />
            <div className="h-8 bg-[var(--surface-2)] rounded w-1/3" />
            <div className="h-24 bg-[var(--surface-2)] rounded w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container-base py-24 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          We couldn't find the product you're looking for. It might have been removed or the link is incorrect.
        </p>
        <Link to="/products">
          <Button size="lg">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  // Determine active states
  const selectedColor = selectedColorState ?? (product.colors.length > 0 ? product.colors[0].name : '');
  const stockAvailable = product.stockByColor[selectedColor] || 0;
  const isOutOfStock = stockAvailable === 0;

  const relatedProducts = relatedData?.items
    .filter((p) => p.id !== id)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      rating: p.rating,
      image: p.images[0] || '',
      category: p.category,
      badgeText: p.isFeatured ? 'Featured' : undefined,
    })) || [];

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      return Math.max(1, Math.min(newQty, stockAvailable));
    });
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    const resolvedHex = product.colors.find(c => c.name === selectedColor)?.hex || "";

    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      selectedColor: { name: selectedColor, hex: resolvedHex },
      quantity
    }));

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  return (
    <div className="container-base py-12">
      {/* Product Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24">

        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-center text-gray-400 font-medium shadow-sm">
            {product.images[selectedImageIndex] ? (
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              'Main Image Placeholder'
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium border-2 transition-all ${selectedImageIndex === idx ? 'border-[var(--primary)]' : 'border-transparent hover:border-[var(--border)]'
                    }`}
                >
                  {img ? (
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    `Thumb ${idx + 1}`
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
              {product.brand}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm font-medium text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="font-medium text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">Color</span>
                <span className="text-sm text-gray-500">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  const isColorOutOfStock = (product.stockByColor[color.name] || 0) === 0;

                  return (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColorState(color.name);
                        const newStock = product.stockByColor[color.name] || 0;
                        setQuantity((prev) => Math.max(1, Math.min(prev, newStock === 0 ? 1 : newStock)));
                      }}
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSelected ? 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg)]' : 'ring-1 ring-[var(--border)] hover:ring-[var(--muted)]'
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
          )}

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center border border-[var(--border)] rounded-md bg-[var(--surface)]">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-[var(--primary)] transition-colors disabled:opacity-50"
              >
                &minus;
              </button>
              <div className="w-12 h-12 flex items-center justify-center font-semibold text-gray-900 text-sm">
                {quantity}
              </div>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= stockAvailable || isOutOfStock}
                className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-[var(--primary)] transition-colors disabled:opacity-50"
              >
                &#43;
              </button>
            </div>

            <Button
              size="lg"
              className={`flex-grow text-base h-12 transition-all ${addedSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : addedSuccess ? 'Added to cart' : 'Add to Cart — $' + (product.price * quantity).toFixed(2)}
            </Button>
          </div>

          <div className="text-sm text-gray-500 italic">
            {isOutOfStock ? 'This item is currently unavailable in the selected color.' :
              stockAvailable < 5 ? `Only ${stockAvailable} left in stock - order soon.` : 'In stock and ready to ship.'}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
            Complete Your Setup
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
