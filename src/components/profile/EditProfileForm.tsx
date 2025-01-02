import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Check } from 'lucide-react';

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean | null;
}

interface EditProfileFormProps {
  initialProfile: Profile;
  onCancel: () => void;
  onSave: () => void;
}

export function EditProfileForm({ initialProfile, onCancel, onSave }: EditProfileFormProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProfile.avatar_url);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewUrl(initialProfile.avatar_url);
    }
  }, [selectedImage, initialProfile.avatar_url]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleConfirmAvatar = async () => {
    if (!selectedImage) return;

    setUploading(true);
    try {
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`public/${profile.username}`, selectedImage, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.path);

        setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
        
        toast({
          title: "Immagine caricata",
          description: "L'immagine del profilo è stata aggiornata con successo",
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dell'immagine",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setSelectedImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile.username?.trim()) {
      toast({
        title: "Errore",
        description: "Lo username è obbligatorio",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          is_public: profile.is_public
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profilo aggiornato",
        description: "Il tuo profilo è stato aggiornato con successo",
      });
      onSave();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploading}
          />
          {selectedImage && (
            <Button
              type="button"
              onClick={handleConfirmAvatar}
              disabled={uploading}
              variant="outline"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          value={profile.username || ''}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografia (opzionale)</Label>
        <Textarea
          id="bio"
          value={profile.bio || ''}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="public-profile"
          checked={profile.is_public || false}
          onCheckedChange={(checked) => setProfile({ ...profile, is_public: checked })}
        />
        <Label htmlFor="public-profile">Profilo pubblico</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Salva'
          )}
        </Button>
      </div>
    </form>
  );
}