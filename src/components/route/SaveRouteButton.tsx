import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface SaveRouteButtonProps {
  routeId: string;
}

export function SaveRouteButton({ routeId }: SaveRouteButtonProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: isSaved, refetch: refetchSavedStatus } = useQuery({
    queryKey: ['routeSaved', routeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('saved_routes')
        .select('id')
        .eq('route_id', routeId)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    },
  });

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: t("common.error"),
          description: t("common.authRequired"),
          variant: "destructive",
        });
        return;
      }

      if (isSaved) {
        await supabase
          .from('saved_routes')
          .delete()
          .eq('route_id', routeId)
          .eq('user_id', user.id);

        toast({
          title: t("routes.unsaved"),
          description: t("routes.unsavedDescription"),
        });
      } else {
        await supabase
          .from('saved_routes')
          .insert({
            route_id: routeId,
            user_id: user.id,
          });

        toast({
          title: t("routes.saved"),
          description: t("routes.savedDescription"),
        });
      }

      refetchSavedStatus();
    } catch (error) {
      console.error('Error saving route:', error);
      toast({
        title: t("common.error"),
        description: t("routes.saveError"),
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSave}
      className="ml-2"
    >
      {isSaved ? (
        <BookmarkCheck className="h-5 w-5 text-primary" />
      ) : (
        <BookmarkPlus className="h-5 w-5" />
      )}
    </Button>
  );
}