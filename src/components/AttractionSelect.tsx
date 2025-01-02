import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMonumentSuggestions } from '../services/attractions';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
}

export function AttractionSelect({ value, onChange, inputType }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const suggestions = getMonumentSuggestions(searchQuery);

  if (inputType === 'address') {
    const geocoder = L.Control.Geocoder.nominatim();

    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Inserisci l'indirizzo esatto"
        className="w-full"
        onFocus={() => {
          geocoder.geocode(value, (results) => {
            if (results.length > 0) {
              const result = results[0];
              setSearchQuery(result.name);
              onChange(result.name);
            }
          });
        }}
      />
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleziona monumento" />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            type="text"
            placeholder="Cerca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {suggestions.map((suggestion) => (
            <SelectItem key={suggestion} value={suggestion}>
              {suggestion}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
