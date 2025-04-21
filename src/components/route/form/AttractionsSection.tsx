
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AttractionInput } from '@/components/AttractionInput';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AttractionsSectionProps {
  form: UseFormReturn<CreateRouteFormData>;
}

export function AttractionsSection({ form }: AttractionsSectionProps) {
  const { t } = useTranslation();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attractions"
  });
  
  const attractionsCount = form.watch('attractionsCount');
  
  const handleAttractionsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (isNaN(count) || count < 1) return;
    
    form.setValue('attractionsCount', count);
    
    // Add or remove attractions based on the new count
    const currentCount = fields.length;
    
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        append({ name: '', address: '', inputType: 'name', visitDuration: 0, price: 0 });
      }
    } else if (count < currentCount) {
      for (let i = currentCount - 1; i >= count; i--) {
        remove(i);
      }
    }
    
    console.log('Attractions count changed:', count);
    console.log('Setting attractions array:', form.getValues('attractions'));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('routes.attractions.title')}</h3>
      
      <FormField
        control={form.control}
        name="attractionsCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('routes.attractions.count')}</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="rounded-r-none"
                  onClick={() => {
                    const newValue = Math.max(1, Number(field.value) - 1);
                    field.onChange(newValue);
                    handleAttractionsCountChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  disabled={field.value <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  className="rounded-none text-center w-16"
                  min={1}
                  max={10}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    handleAttractionsCountChange(e);
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="rounded-l-none"
                  onClick={() => {
                    const newValue = Math.min(10, Number(field.value) + 1);
                    field.onChange(newValue);
                    handleAttractionsCountChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  disabled={field.value >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md space-y-4">
            <h4 className="font-medium">{t('routes.attractions.attraction')} {index + 1}</h4>
            
            <AttractionInput
              form={form}
              index={index}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`attractions.${index}.visitDuration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('routes.attractions.visitDuration')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min={0}
                          {...field}
                        />
                        <span className="ml-2">{t('routes.attractions.minutes')}</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`attractions.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('routes.attractions.price')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min={0}
                          step={0.5}
                          {...field}
                        />
                        <span className="ml-2">€</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
