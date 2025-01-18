import { Helmet } from 'react-helmet';

interface BlogPostMetaProps {
  title: string;
  description: string;
  imageUrl: string;
  postUrl: string;
}

export function BlogPostMeta({ title, description, imageUrl, postUrl }: BlogPostMetaProps) {
  // Ensure all values are strings and not undefined
  const safeTitle = String(title || '');
  const safeDescription = String(description || '');
  const safeImageUrl = imageUrl ? String(imageUrl) : '';
  const safePostUrl = String(postUrl || window.location.href);

  return (
    <Helmet>
      <title>{`${safeTitle} | WayWonder Blog`}</title>
      <meta name="description" content={safeDescription} />
      
      {/* Open Graph meta tags for Facebook */}
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={safePostUrl} />
      {safeImageUrl && (
        <>
          <meta property="og:image" content={safeImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:site_name" content="WayWonder" />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      {safeImageUrl && <meta name="twitter:image" content={safeImageUrl} />}
    </Helmet>
  );
}