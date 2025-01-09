import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function CreatePostInput() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const REQUIRED_WORDS = 50;

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
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          content,
          title: content.split('\n')[0].slice(0, 100),
          user_id: user.id,
          is_published: true
        });

      if (error) throw error;

      setContent('');
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

  return (
    <Card className="p-4 mb-8">
      <Textarea
        placeholder="Cosa vuoi condividere oggi?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] mb-4"
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{wordCount} parole</span>
          <span>{REQUIRED_WORDS - wordCount} parole rimanenti</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-2" />
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || wordCount < REQUIRED_WORDS}
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
    </Card>
  );
}