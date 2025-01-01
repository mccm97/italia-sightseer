import React from 'react';

interface CountrySelectProps {
  countries: string[];
  onCountrySelect: (country: string) => void;
}

const CountrySelect = ({ countries, onCountrySelect }: CountrySelectProps) => {
  return (
    <select onChange={(e) => onCountrySelect(e.target.value)} className="w-full p-2 border rounded-md">
      <option value="">Seleziona un paese</option>
      {countries.map((country, index) => (
        <option key={index} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;
