import React from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAttractions } from '@/hooks/useAttractions';

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
  cityId?: string;
}

export function AttractionSelect({ value, onChange, inputType, cityId }: AttractionSelectProps) {
  const {
    filteredAttractions,
    isLoading,
    searchQuery,
    setSearchQuery
  } = useAttractions(cityId);
  const [isOpen, setIsOpen] = React.useState(false);

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
    <Select
      value={value}
      onValueChange={(value) => {
        onChange(value);
        setSearchQuery('');
        setIsOpen(false);
      }}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleziona un monumento..." />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca monumento..."
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              Caricamento...
            </div>
          ) : filteredAttractions.length > 0 ? (
            filteredAttractions.map((attraction) => (
              <SelectItem 
                key={attraction.name} 
                value={attraction.name}
              >
                {attraction.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              Nessun monumento trovato
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}