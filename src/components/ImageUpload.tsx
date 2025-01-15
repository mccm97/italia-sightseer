import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  bucketName: string;
  className?: string;
  currentImage?: string | null;
}

export function ImageUpload({ onImageUploaded, bucketName, className = '', currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  console.log('ImageUpload - Current image:', currentImage);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      console.log('ImageUpload - Uploading file:', filePath);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log('ImageUpload - Upload successful, public URL:', publicUrl);

      onImageUploaded(publicUrl);
      toast({
        title: t('common.success'),
        description: t('blog.imageUpload.success'),
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t('common.error'),
        description: t('blog.imageUpload.error'),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    console.log('ImageUpload - Removing image');
    onImageUploaded('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImage && (
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <div className="aspect-video w-full relative">
            <img 
              src={currentImage} 
              alt={t('blog.imageUpload.preview')}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="cursor-pointer"
        />
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
    </div>
  );
}