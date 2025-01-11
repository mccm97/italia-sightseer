import { CitySearchButton } from '@/components/home/CitySearchButton';
import type { City } from '@/components/CitySearch';

interface SearchHeaderProps {
  user: any;
  setSelectedCity: React.Dispatch<React.SetStateAction<City | null>>;
}

export function SearchHeader({ user, setSelectedCity }: SearchHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cerca</h1>
        {user && (
          <div className="text-sm">
            Benvenuto, {user.username || 'Utente'}
          </div>
        )}
      </div>
      <CitySearchButton onCitySelect={setSelectedCity} />
    </div>
  );
}