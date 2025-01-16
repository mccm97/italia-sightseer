import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { AttractionInput } from '@/components/AttractionInput';
import { useEffect } from 'react';

interface AttractionsSectionProps {
  form: UseFormReturn<CreateRouteFormData>;
}

export function AttractionsSection({ form }: AttractionsSectionProps) {
  const attractionsCount = form.watch('attractionsCount');

  useEffect(() => {
    console.log('Attractions count changed:', attractionsCount);
    
    // Ensure valid count
    const count = Math.max(1, Math.floor(attractionsCount) || 1);
    if (count !== attractionsCount) {
      form.setValue('attractionsCount', count);
      return;
    }

    const currentAttractions = form.getValues('attractions') || [];
    
    // Create new array with the correct length
    const updatedAttractions = Array.from({ length: count }, (_, index) => {
      return currentAttractions[index] || { 
        name: '', 
        address: '', 
        inputType: 'name' as const, 
        visitDuration: 0, 
        price: 0 
      };
    });

    console.log('Setting attractions array:', updatedAttractions);
    form.setValue('attractions', updatedAttractions);
  }, [attractionsCount, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="attractionsCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero di Attrazioni</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1"
                placeholder="Inserisci il numero di attrazioni"
                {...field}
                onChange={e => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch('attractions')?.map((_, index) => (
        <AttractionInput
          key={index}
          index={index}
          form={form}
        />
      ))}
    </div>
  );
}