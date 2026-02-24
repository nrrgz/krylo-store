

export interface RatingStarsProps {
  rating: number; // 0 to 5
  maxStars?: number;
  className?: string;
}

export function RatingStars({ rating, maxStars = 5, className = '' }: RatingStarsProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} title={`Rating: ${rating} out of ${maxStars}`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const fillValue = Math.max(0, Math.min(1, rating - index));
        return (
          <div key={index} className="relative w-4 h-4 text-gray-200">
            {/* Background (Empty) Star */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute top-0 left-0 text-gray-200"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>

            {/* Foreground (Filled) Star */}
            <div
              className="absolute top-0 left-0 overflow-hidden text-yellow-400"
              style={{ width: `${fillValue * 100}%` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
