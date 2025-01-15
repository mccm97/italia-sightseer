import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search } from 'lucide-react';

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
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
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
                  className="pl-10 pr-10 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  disabled={!selectedCountry}
                >
                  <ChevronDown className={`h-4 w-4 opacity-50 transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              {showSuggestions && search && selectedCountry && (
                <Card className="absolute z-50 w-full mt-1 shadow-lg">
                  <ScrollArea className="max-h-[200px]">
                    <div className="p-2 space-y-1">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <button
                            key={city.id}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-150"
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
                          {search.length < 2 ? 
                            "Digita almeno 2 caratteri per cercare" : 
                            "Nessuna città trovata"}
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