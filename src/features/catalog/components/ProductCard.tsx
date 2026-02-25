import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { RatingStars } from '../../../components/ui/RatingStars';

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  badgeText?: string;
  onAddToCart?: () => void;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  rating,
  image,
  badgeText,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white hover:border-gray-400 group transition-colors shadow-sm w-full max-w-[320px] mx-auto">
      <Link to={`/products/${id}`} className="flex flex-col flex-grow">
        <div className="aspect-square bg-gray-50 flex items-center justify-center relative p-4">
          {badgeText && (
            <Badge className="absolute top-3 left-3 bg-gray-900 text-white border-0 z-10 text-[10px] px-2 py-0.5">
              {badgeText}
            </Badge>
          )}
          <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center text-gray-400 font-mono text-xs">
            {image ? 'Image Placeholder' : 'No Image'}
          </div>
        </div>

        <CardHeader className="flex-grow pb-2 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{brand}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
              <RatingStars rating={rating} className="scale-75 origin-right" />
            </div>
          </div>
          <CardTitle className="text-base sm:text-lg leading-snug font-bold text-gray-900 group-hover:underline underline-offset-4 decoration-gray-300">
            {name}
          </CardTitle>
        </CardHeader>
      </Link>

      <CardContent className="p-5 pt-0 mt-auto flex items-center justify-between">
        <span className="font-extrabold text-gray-900 text-lg">
          ${price.toFixed(2)}
        </span>

        {onAddToCart && (
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart();
            }}
            className="rounded-full shadow-sm"
          >
            Add
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
