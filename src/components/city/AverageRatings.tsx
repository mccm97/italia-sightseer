import { Star } from 'lucide-react';

interface RatingCategory {
  name: string;
  key: string;
  label: string;
}

interface AverageRatingsProps {
  categories: RatingCategory[];
  averageRatings: Record<string, number>;
  totalReviews: number;
}

export function AverageRatings({ categories, averageRatings, totalReviews }: AverageRatingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Media Recensioni</h3>
      {categories.map(category => (
        <div key={category.key} className="space-y-2">
          <div className="flex justify-between items-center">
            <span>{category.label}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(value => (
                <Star
                  key={value}
                  className={`h-5 w-5 ${
                    value <= averageRatings[category.name]
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      <p className="text-sm text-gray-500 mt-2">
        Basato su {totalReviews} recensioni
      </p>
    </div>
  );
}