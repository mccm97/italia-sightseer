import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';

interface TransportModeSelectProps {
  form: UseFormReturn<CreateRouteFormData>;
}

export function TransportModeSelect({ form }: TransportModeSelectProps) {
  return (
    <FormField
      control={form.control}
      name="transportMode"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Modalità di Trasporto</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="walking" id="walking" />
                <FormLabel htmlFor="walking">Solo a Piedi</FormLabel>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <FormLabel htmlFor="public">Mezzi Pubblici</FormLabel>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}