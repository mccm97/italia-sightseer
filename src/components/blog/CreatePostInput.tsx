import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import CitySearch from '@/components/CitySearch';
import { Switch } from '@/components/ui/switch';

export function CreatePostInput() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isAboutCity, setIsAboutCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const REQUIRED_WORDS = 100;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const words = content.trim().split(/\s+/);
    setWordCount(words.length === 1 && words[0] === '' ? 0 : words.length);
  }, [content]);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per pubblicare",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un titolo per il post",
        variant: "destructive",
      });
      return;
    }

    if (wordCount < REQUIRED_WORDS) {
      toast({
        title: "Contenuto troppo breve",
        description: `Il post deve contenere almeno ${REQUIRED_WORDS} parole. Attualmente: ${wordCount} parole`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: post, error } = await supabase
        .from('blog_posts')
        .insert({
          title: title.trim(),
          content,
          user_id: user.id,
          is_published: true,
          cover_image_url: coverImage,
          city_id: isAboutCity ? selectedCity?.id : null
        })
        .select()
        .single();

      if (error) throw error;

      setContent('');
      setTitle('');
      setCoverImage(null);
      setIsAboutCity(false);
      setSelectedCity(null);
      toast({
        title: "Post pubblicato",
        description: "Il tuo post è stato pubblicato con successo",
      });

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la pubblicazione del post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const progress = (wordCount / REQUIRED_WORDS) * 100;
  const remainingWords = Math.max(0, REQUIRED_WORDS - wordCount);

  return (
    <Card className="p-4 mb-8">
      <div className="space-y-4">
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

        <div>
          <Label>Immagine di copertina</Label>
          <ImageUpload
            onImageUploaded={setCoverImage}
            bucketName="blog-images"
            currentImage={coverImage}
            className="mb-4"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="city-mode"
            checked={isAboutCity}
            onCheckedChange={setIsAboutCity}
          />
          <Label htmlFor="city-mode" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Parli di una città specifica?</span>
          </Label>
        </div>

        {isAboutCity && (
          <div className="mt-4">
            <Label>Seleziona la città</Label>
            <CitySearch
              onCitySelect={setSelectedCity}
            />
          </div>
        )}

        <div>
          <Label htmlFor="content">Contenuto</Label>
          <Textarea
            id="content"
            placeholder="Cosa vuoi condividere oggi?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{wordCount} parole</span>
            <span>{remainingWords} parole rimanenti</span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || wordCount < REQUIRED_WORDS || !title.trim() || (isAboutCity && !selectedCity)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pubblicazione...
                </>
              ) : (
                'Pubblica'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
