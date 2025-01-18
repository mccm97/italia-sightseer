import { Helmet } from 'react-helmet';

interface BlogPostMetaProps {
  title: string;
  description: string;
  imageUrl: string;
  postUrl: string;
}

export function BlogPostMeta({ title, description, imageUrl, postUrl }: BlogPostMetaProps) {
  return (
    <Helmet>
      <title>{`${title} | WayWonder Blog`}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph meta tags for Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={postUrl} />
      {imageUrl && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:site_name" content="WayWonder" />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
}