import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EditProfileFormProps {
  initialProfile: any;
  onCancel: () => void;
  onSave: () => void;
}

export function EditProfileForm({ initialProfile, onCancel, onSave }: EditProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar_url);
  const { toast } = useToast();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatar(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleConfirmAvatar = async () => {
    if (!avatar) return;
    setUploading(true);

    try {
      const fileExt = avatar.name.split('.').pop();
      const filePath = `${profile.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatar);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the profile in the database with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({ ...profile, avatar_url: publicUrl });
      setPreviewUrl(publicUrl);
      
      toast({
        title: "Immagine caricata",
        description: "L'immagine del profilo è stata aggiornata",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dell'immagine",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setAvatar(null);
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
        .update(profile)
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
          <AvatarImage src={selectedImage || previewUrl} />
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
          value={profile?.username || ''}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografia (opzionale)</Label>
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

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
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
      </div>
    </form>
  );
}