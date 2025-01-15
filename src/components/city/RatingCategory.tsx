import { Star } from 'lucide-react';

interface RatingCategoryProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function RatingCategory({ label, value, onChange }: RatingCategoryProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= value
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}