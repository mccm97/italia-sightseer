
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { useTranslation } from "react-i18next";

interface PostCoverImageProps {
  coverImage: string | null;
  setCoverImage: (url: string | null) => void;
}

export function PostCoverImage({ coverImage, setCoverImage }: PostCoverImageProps) {
  const { t } = useTranslation();
  
  return (
    <div>
      <Label>{t('blog.writePost.coverImage')}</Label>
      <ImageUpload
        onImageUploaded={setCoverImage}
        bucketName="blog-images"
        currentImage={coverImage}
        className="mb-4"
      />
    </div>
  );
}
