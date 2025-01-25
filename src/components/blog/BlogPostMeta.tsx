import { Helmet } from 'react-helmet';

interface BlogPostMetaProps {
  title: string;
  description: string;
  imageUrl: string;
  postUrl: string;
}

export function BlogPostMeta({ title, description, imageUrl, postUrl }: BlogPostMetaProps) {
  // Ensure all values are strings and have fallbacks
  const metaTitle = String(title || 'Blog Post');
  const metaDescription = String(description || '');
  const metaImage = String(imageUrl || '');
  const metaUrl = String(postUrl || '');

  return (
    <Helmet>
      <title>{metaTitle} | WayWonder</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}