import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface CitySelectorProps {
  form: UseFormReturn<CreateRouteFormData>;
  cities: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    country: string;
  }>;
  selectedCountry: string;
}

export function CitySelector({ form, cities, selectedCountry }: CitySelectorProps) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = cities
    .filter(city => city.country === selectedCountry)
    .filter(city => city.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Città</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="text"
                placeholder="Cerca una città..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                disabled={!selectedCountry}
              />
              
              {showSuggestions && search && selectedCountry && (
                <Card className="absolute z-50 w-full mt-1 shadow-lg">
                  <ScrollArea className="max-h-[200px]">
                    <div className="p-2 space-y-1">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <button
                            key={city.id}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                            onClick={() => {
                              field.onChange(city);
                              setSearch(city.name);
                              setShowSuggestions(false);
                            }}
                          >
                            {city.name}
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-center text-gray-500">
                          Nessuna città trovata
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}