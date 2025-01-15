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
        console.log('ImageUpload - No file selected');
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      console.log('ImageUpload - Starting upload of file:', file.name);
      console.log('ImageUpload - File size:', file.size, 'bytes');
      console.log('ImageUpload - File type:', file.type);
      console.log('ImageUpload - Generated filename:', fileName);

      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        console.error('ImageUpload - Upload error:', uploadError);
        throw uploadError;
      }

      console.log('ImageUpload - Upload successful, data:', data);

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('ImageUpload - Generated public URL:', publicUrl);

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
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={currentImage} 
            alt={t('blog.imageUpload.preview')}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('ImageUpload - Error loading image:', e);
              const imgElement = e.target as HTMLImageElement;
              console.log('ImageUpload - Failed image src:', imgElement.src);
            }}
            onLoad={() => {
              console.log('ImageUpload - Image loaded successfully');
            }}
          />
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