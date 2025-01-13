import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface PostTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

export function PostTitleInput({ title, setTitle }: PostTitleInputProps) {
  const { t } = useTranslation();
  
  return (
    <div>
      <Label htmlFor="title">{t('blog.writePost.title')}</Label>
      <Input
        id="title"
        placeholder={t('blog.writePost.title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />
    </div>
  );
}