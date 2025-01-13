import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface PostContentProps {
  content: string;
  setContent: (content: string) => void;
  wordCount: number;
  remainingWords: number;
  progress: number;
}

export function PostContent({ 
  content, 
  setContent, 
  wordCount, 
  remainingWords,
  progress 
}: PostContentProps) {
  const { t } = useTranslation();

  return (
    <div>
      <Label htmlFor="content">{t('blog.writePost.content')}</Label>
      <Textarea
        id="content"
        placeholder={t('blog.writePost.content')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{wordCount} {t('blog.writePost.wordCount')}</span>
          <span>{remainingWords} {t('blog.writePost.remainingWords')}</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-2" />
      </div>
    </div>
  );
}