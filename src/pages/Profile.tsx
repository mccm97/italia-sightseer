import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { UserRoutes } from '@/components/profile/UserRoutes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        setUser(user);

        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingProfile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: user.id }])
            .select()
            .maybeSingle();

          if (insertError) throw insertError;
          setProfile(newProfile);
        } else {
          setProfile(existingProfile);
        }

      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento del profilo",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="flex justify-start mb-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Indietro
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          {isEditing ? (
            <EditProfileForm
              initialProfile={profile}
              onCancel={() => setIsEditing(false)}
              onSave={() => setIsEditing(false)}
            />
          ) : (
            <>
              <ProfileHeader
                username={profile?.username}
                avatarUrl={profile?.avatar_url}
                bio={profile?.bio}
                onEditClick={() => setIsEditing(true)}
                userId={profile?.id}
                subscriptionLevel={profile?.subscription_level || 'bronze'}
              />
              <UserRoutes />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}