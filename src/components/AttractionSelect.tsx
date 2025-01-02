import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (inputType === 'address' && searchQuery) {
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(searchQuery, (results) => {
        const newSuggestions = results.map(result => result.name);
        setSuggestions(newSuggestions);
      });
    }
  }, [searchQuery, inputType]);

  if (inputType === 'address') {
    return (
      <div>
        <Input
          type="text"
          value={value}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Inserisci l'indirizzo esatto"
          className="w-full"
        />
        {suggestions.length > 0 && (
          <ScrollArea className="h-[200px]">
            {suggestions.map((suggestion, index) => (
              <SelectItem
                key={index}
                value={suggestion}
                onClick={() => onChange(suggestion)}
              >
                {suggestion}
              </SelectItem>
            ))}
          </ScrollArea>
        )}
      </div>
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
          {suggestions.map((suggestion, index) => (
            <SelectItem key={index} value={suggestion}>
              {suggestion}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
