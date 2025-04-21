
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { ImageUpload } from '@/components/ImageUpload';
import { AIRouteGenerator } from '../AIRouteGenerator';
import { useTranslation } from 'react-i18next';

interface RouteBasicInfoProps {
  form: UseFormReturn<CreateRouteFormData>;
}

export function RouteBasicInfo({ form }: RouteBasicInfoProps) {
  const { t } = useTranslation();
  
  const handleImageUploaded = (url: string) => {
    form.setValue('image_url', url);
  };

  const cityName = form.watch('city')?.name;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('routes.basicInfo.title')}</h3>
        <AIRouteGenerator form={form} cityName={cityName} />
      </div>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('routes.basicInfo.routeName')}</FormLabel>
            <FormControl>
              <Input placeholder={t('routes.basicInfo.routeNamePlaceholder')} {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('routes.basicInfo.routeDescription')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('routes.basicInfo.routeDescriptionPlaceholder')} 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              {t('routes.basicInfo.routeDescriptionHelp')}
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('routes.basicInfo.routeImage')}</FormLabel>
            <FormControl>
              <ImageUpload
                bucketName="route-images"
                onImageUploaded={handleImageUploaded}
                currentImage={field.value}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
