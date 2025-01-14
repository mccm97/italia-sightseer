import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { UserRoutes } from '@/components/profile/UserRoutes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserComments } from '@/components/profile/UserComments';
import { UserBlogPosts } from '@/components/profile/UserBlogPosts';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { SavedRoutes } from '@/components/profile/SavedRoutes';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: userId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const getProfile = async () => {
      try {
        console.log('Fetching profile for userId:', userId);
        
        // Get current authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setCurrentUser(authUser);

        // If no userId in params and user is authenticated, use their ID
        const targetUserId = userId || authUser?.id;

        if (!targetUserId) {
          console.log('No target user ID found, redirecting to login');
          navigate('/login');
          return;
        }

        // Fetch profile for target user
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching profile:', fetchError);
          throw fetchError;
        }

        if (!existingProfile) {
          console.log('Profile not found');
          toast({
            title: "Errore",
            description: "Profilo non trovato",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        console.log('Profile found:', existingProfile);
        setProfile(existingProfile);

      } catch (error: any) {
        console.error('Error in getProfile:', error);
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
  }, [navigate, toast, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile?.id;

  return (
    <>
      <Helmet>
        <title>{t('profile.title')} - WayWonder</title>
        <meta name="description" content={t('profile.metaDescription')} />
        <meta name="keywords" content={t('profile.metaKeywords')} />
        <link rel="canonical" href="https://www.waywonder.info/profile" />
        <meta property="og:title" content={`${t('profile.title')} - WayWonder`} />
        <meta property="og:description" content={t('profile.metaDescription')} />
        <meta property="og:url" content="https://www.waywonder.info/profile" />
      </Helmet>
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex justify-start mb-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('profile.back')}
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            {isEditing && isOwnProfile ? (
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
                  onEditClick={() => isOwnProfile && setIsEditing(true)}
                  profileId={profile?.id}
                  currentUserId={currentUser?.id}
                  subscriptionLevel={profile?.subscription_level || 'bronze'}
                  showEditButton={isOwnProfile}
                />
                <Tabs defaultValue="routes" className="mt-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="routes" className="flex-1">{t('profile.routes')}</TabsTrigger>
                    <TabsTrigger value="saved" className="flex-1">{t('profile.savedRoutes')}</TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1">{t('profile.comments')}</TabsTrigger>
                    <TabsTrigger value="posts" className="flex-1">{t('profile.posts')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="routes">
                    <UserRoutes userId={profile?.id} />
                  </TabsContent>
                  <TabsContent value="saved">
                    <SavedRoutes userId={profile?.id} />
                  </TabsContent>
                  <TabsContent value="comments">
                    <UserComments userId={profile?.id} />
                  </TabsContent>
                  <TabsContent value="posts">
                    <UserBlogPosts userId={profile?.id} />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
