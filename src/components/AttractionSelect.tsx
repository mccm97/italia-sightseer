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
import { getMonumentSuggestions } from '../services/attractions';

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
  cityId?: string;
}

export function AttractionSelect({ value, onChange, inputType, cityId }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (cityId) {
        const monumentSuggestions = await getMonumentSuggestions(searchQuery, cityId);
        setSuggestions(monumentSuggestions);
      }
    };

    fetchSuggestions();
  }, [searchQuery, cityId]);

  if (inputType === 'address') {
    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Inserisci l'indirizzo esatto"
        className="w-full"
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