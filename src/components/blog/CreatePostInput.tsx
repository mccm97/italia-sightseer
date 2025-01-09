import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export function CreatePostInput() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    if (content.trim().split(/\s+/).length < 50) {
      toast({
        title: "Contenuto troppo breve",
        description: "Il post deve contenere almeno 50 parole",
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
          user_id: user?.id,
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

  return (
    <Card className="p-4 mb-8">
      <Textarea
        placeholder="Cosa vuoi condividere oggi?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] mb-4"
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || content.trim().length === 0}
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
    </Card>
  );
}