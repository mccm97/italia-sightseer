import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface CountrySelectorProps {
  form: UseFormReturn<CreateRouteFormData>;
  countries: string[];
  onCountrySelect: (country: string) => void;
}

export function CountrySelector({ form, countries, onCountrySelect }: CountrySelectorProps) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Paese</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="relative flex">
                <Input
                  type="text"
                  placeholder="Cerca un paese..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </div>
              
              {showSuggestions && (
                <Card className="absolute z-50 w-full mt-1 shadow-lg">
                  <ScrollArea className="max-h-[200px]">
                    <div className="p-2 space-y-1">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country, index) => (
                          <button
                            key={`${country}-${index}`}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                            onClick={() => {
                              field.onChange(country);
                              onCountrySelect(country);
                              setSearch(country);
                              setShowSuggestions(false);
                            }}
                          >
                            {country}
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-center text-gray-500">
                          Nessun paese trovato
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