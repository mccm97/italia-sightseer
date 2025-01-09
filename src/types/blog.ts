export interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  cover_image_url: string | null;
  is_published: boolean;
  creator?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}