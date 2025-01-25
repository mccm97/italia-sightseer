import { Helmet } from 'react-helmet';

interface BlogPostMetaProps {
  title: string;
  description: string;
  imageUrl?: string;
  postUrl: string;
}

export function BlogPostMeta({ title, description, imageUrl, postUrl }: BlogPostMetaProps) {
  const safeTitle = String(title || 'WayWonder Blog');
  const safeDescription = String(description || '');
  const safeUrl = String(postUrl);
  const safeImageUrl = imageUrl ? String(imageUrl) : '';

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={safeUrl} />
      {safeImageUrl && (
        <>
          <meta property="og:image" content={safeImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:site_name" content="WayWonder" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      {safeImageUrl && (
        <meta name="twitter:image" content={safeImageUrl} />
      )}
      <meta name="twitter:site" content="@waywonder" />
    </Helmet>
  );
}