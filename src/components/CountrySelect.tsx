import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CountrySelectProps {
  onCountrySelect: (country: string | null) => void;
}

export default function CountrySelect({ onCountrySelect }: CountrySelectProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [countries, setCountries] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    filterCountries();
  }, [searchTerm, countries]);

  const loadCountries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('cities')
        .select('country')
        .not('country', 'is', null)
        .not('country', 'eq', '')
        .order('country');

      if (supabaseError) {
        console.error('Error loading countries:', supabaseError);
        setError('Errore nel caricamento delle nazioni');
        setCountries([]);
        return;
      }

      if (data && Array.isArray(data)) {
        const uniqueCountries = Array.from(
          new Set(
            data
              .map(item => item.country)
              .filter((country): country is string => typeof country === 'string' && country.trim().length > 0)
          )
        ).sort();
        setCountries(uniqueCountries);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error in loadCountries:', error);
      setError('Errore nel caricamento delle nazioni');
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCountries = () => {
    const filtered = countries.filter(country =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  return (
    <div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cerca nazione..."
        className="w-full"
      />
      {error && <span className="text-red-500">{error}</span>}
      {isLoading ? (
        <div className="flex items-center justify-center py-2">
          Caricamento...
        </div>
      ) : (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country}>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => onCountrySelect(country)}
              >
                {country}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
