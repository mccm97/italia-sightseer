import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfile(profile);
      }

      setLoading(false);
    };

    getProfile();
  }, [navigate]);

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        profile.avatar_url = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profilo aggiornato",
        description: "Il tuo profilo è stato aggiornato con successo",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del profilo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Il tuo profilo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile?.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={profile?.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public-profile"
                checked={profile?.is_public || false}
                onCheckedChange={(checked) => setProfile({ ...profile, is_public: checked })}
              />
              <Label htmlFor="public-profile">Profilo pubblico</Label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                'Salva modifiche'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}