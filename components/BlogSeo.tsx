import React from 'react';
import Head from 'next/head';
import { BlogMetadata } from '~/lib/blogMetadata';

export interface BlogSeoProps {
  metadata: BlogMetadata;
}

export default function BlogSeo({ metadata }: BlogSeoProps) {
  const {
    title,
    description,
    canonicalUrl,
    coverUrl,
    authors,
    twitterCreator,
    date,
  } = metadata;

  const cardType = coverUrl ? 'summary_large_image' : 'summary';

  return (
    <Head>
      <title key='title'>{title}</title>
      <meta name='description' content={description} key='description' />
      <link rel='canonical' href={canonicalUrl} key='canonical' />

      {/* Open Graph */}
      <meta property='og:type' content='article' key='og:type' />
      <meta property='og:title' content={title} key='og:title' />
      <meta
        property='og:description'
        content={description}
        key='og:description'
      />
      <meta property='og:url' content={canonicalUrl} key='og:url' />
      {coverUrl && (
        <meta property='og:image' content={coverUrl} key='og:image' />
      )}

      {/* Twitter Card */}
      <meta name='twitter:card' content={cardType} key='twitter:card' />
      <meta name='twitter:title' content={title} key='twitter:title' />
      <meta
        name='twitter:description'
        content={description}
        key='twitter:description'
      />
      {coverUrl && (
        <meta name='twitter:image' content={coverUrl} key='twitter:image' />
      )}
      {twitterCreator && (
        <meta
          name='twitter:creator'
          content={twitterCreator}
          key='twitter:creator'
        />
      )}

      {/* Article Metadata */}
      {date && (
        <meta
          property='article:published_time'
          content={date}
          key='article:published_time'
        />
      )}
      {authors.map((authorName, idx) => (
        <meta
          key={`article:author:${idx}`}
          property='article:author'
          content={authorName}
        />
      ))}
    </Head>
  );
}
