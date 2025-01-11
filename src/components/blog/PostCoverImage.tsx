import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";

interface PostCoverImageProps {
  coverImage: string | null;
  setCoverImage: (url: string | null) => void;
}

export function PostCoverImage({ coverImage, setCoverImage }: PostCoverImageProps) {
  return (
    <div>
      <Label>Immagine di copertina</Label>
      <ImageUpload
        onImageUploaded={setCoverImage}
        bucketName="blog-images"
        currentImage={coverImage}
        className="mb-4"
      />
    </div>
  );
}