import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

export function PostTitleInput({ title, setTitle }: PostTitleInputProps) {
  return (
    <div>
      <Label htmlFor="title">Titolo del post</Label>
      <Input
        id="title"
        placeholder="Inserisci il titolo del post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />
    </div>
  );
}