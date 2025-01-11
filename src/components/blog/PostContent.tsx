import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

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
  return (
    <div>
      <Label htmlFor="content">Contenuto</Label>
      <Textarea
        id="content"
        placeholder="Cosa vuoi condividere oggi?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{wordCount} parole</span>
          <span>{remainingWords} parole rimanenti</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-2" />
      </div>
    </div>
  );
}