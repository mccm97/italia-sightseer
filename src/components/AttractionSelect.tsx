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
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';

// Add type declaration for the Geocoder
declare module 'leaflet' {
  namespace Control {
    interface GeocoderOptions {
      geocodingQueryParams?: {
        countrycodes?: string;
        limit?: number;
        format?: string;
      };
    }
    
    class Geocoder extends Control {
      constructor(options?: GeocoderOptions);
      geocode(query: string, cb: (results: any[]) => void): void;
    }

    namespace Geocoder {
      function nominatim(options?: GeocoderOptions): Geocoder;
    }
  }
}

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
}

interface GeocodingResult {
  name: string;
  center: L.LatLngLiteral;
  bbox: L.LatLngBoundsLiteral;
  properties: {
    address: {
      road?: string;
      house_number?: string;
      postcode?: string;
      city?: string;
      country?: string;
    };
  };
}

export function AttractionSelect({ value, onChange, inputType }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (inputType === 'address' && searchQuery) {
      const geocoder = L.Control.Geocoder.nominatim({
        geocodingQueryParams: {
          countrycodes: 'it', // Limit to Italy
          limit: 5,
          format: 'json'
        }
      });

      try {
        geocoder.geocode(searchQuery, (results) => {
          if (Array.isArray(results)) {
            const addresses = results.map((result: GeocodingResult) => {
              const { properties } = result;
              const { address } = properties;
              return [
                address.road,
                address.house_number,
                address.postcode,
                address.city,
                'Italy'
              ].filter(Boolean).join(', ');
            });
            setSuggestions(addresses);
          }
        });
      } catch (error) {
        console.error('Geocoding error:', error);
        setSuggestions([]);
      }
    } else if (inputType === 'name') {
      setSuggestions(getMonumentSuggestions(searchQuery));
    }
  }, [searchQuery, inputType]);

  if (inputType === 'address') {
    return (
      <div className="space-y-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Inserisci l'indirizzo esatto"
          className="w-full"
        />
        {suggestions.length > 0 && (
          <ScrollArea className="h-[200px] border rounded-md">
            <div className="p-2 space-y-1">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-accent rounded-sm cursor-pointer"
                  onClick={() => {
                    onChange(suggestion);
                    setSearchQuery(suggestion);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
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