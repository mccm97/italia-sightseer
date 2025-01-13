import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { PostTitleInput } from './PostTitleInput';
import { PostCoverImage } from './PostCoverImage';
import { CitySelector } from './CitySelector';
import { PostContent } from './PostContent';
import { useTranslation } from 'react-i18next';

const REQUIRED_WORDS = 100;

interface CreatePostInputProps {
  onPostCreated?: () => Promise<void>;
}

export function CreatePostInput({ onPostCreated }: CreatePostInputProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isAboutCity, setIsAboutCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const { t } = useTranslation();

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
      
      if (onPostCreated) {
        await onPostCreated();
      }

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
        <PostTitleInput title={title} setTitle={setTitle} />
        <PostCoverImage coverImage={coverImage} setCoverImage={setCoverImage} />
        <CitySelector 
          isAboutCity={isAboutCity}
          setIsAboutCity={setIsAboutCity}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
        <PostContent 
          content={content}
          setContent={setContent}
          wordCount={wordCount}
          remainingWords={remainingWords}
          progress={progress}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || wordCount < REQUIRED_WORDS || !title.trim() || (isAboutCity && !selectedCity)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('blog.writePost.publishing')}
              </>
            ) : (
              t('blog.writePost.publish')
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}