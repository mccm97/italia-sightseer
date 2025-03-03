
import { MainMenu } from '@/components/MainMenu';
import { BlogPostMeta } from './BlogPostMeta';
import { BlogPostContent } from './BlogPostContent';
import { BlogComments } from './BlogComments';
import { BlogPostLoading } from './BlogPostLoading';
import { BlogPostBackButton } from './BlogPostBackButton';
import { useBlogPost } from '@/hooks/useBlogPost';

export function BlogPostContainer() {
  const {
    post,
    loading,
    comments,
    submittingComment,
    likes,
    isLiked,
    isLikeLoading,
    currentUser,
    handleLike,
    handleShare,
    handleSubmitComment
  } = useBlogPost();

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <MainMenu />
        <BlogPostLoading />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-4">
        <MainMenu />
        <div className="text-center py-12">
          <p className="text-gray-500">Post non trovato</p>
        </div>
      </div>
    );
  }

  const metaDescription = post.content && typeof post.content === 'string'
    ? (post.content.length > 140 
        ? post.content.substring(0, 137) + '...'
        : post.content)
    : '';

  const absoluteCoverImageUrl = post.cover_image_url
    ? new URL(post.cover_image_url, window.location.origin).toString()
    : '';
  const postUrl = `${window.location.origin}/blog/${post.id}`;

  return (
    <>
      <BlogPostMeta
        title={post.title || ''}
        description={metaDescription}
        imageUrl={absoluteCoverImageUrl}
        postUrl={postUrl}
      />

      <div className="container mx-auto p-4">
        <MainMenu />
        <div className="max-w-3xl mx-auto mt-8">
          <BlogPostBackButton />

          <BlogPostContent
            post={post}
            currentUser={currentUser}
            likes={likes}
            isLiked={isLiked}
            isLoading={isLikeLoading}
            onLike={handleLike}
            onShare={handleShare}
          />

          <BlogComments
            comments={comments}
            onSubmitComment={handleSubmitComment}
            isSubmitting={submittingComment}
          />
        </div>
      </div>
    </>
  );
}
