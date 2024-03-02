import fs from 'fs';
import { Feed, Author, Item } from 'feed';

const SITE_URL = 'https://json-schema.org';

export default async function generateRssFeed(blogPosts: any) {
  const today = new Date();
  const feed = new Feed({
    title: 'JSON Schema Blog RSS Feed',
    description: 'JSON Schema Blog',
    id: SITE_URL,
    link: `${SITE_URL}/blog`,
    image: `${SITE_URL}/logo-blue.svg`,
    favicon: `${SITE_URL}/favicon.png`,
    copyright: 'Made with :love: by the JSON Schema team.',
    updated: today,
    generator: 'nextjs',
    feedLinks: {
      rss2: `${SITE_URL}/rss/feed.xml`,
      json: `${SITE_URL}/rss/feed.json`,
      atom: `${SITE_URL}/rss/atom.xml`,
    },
    language: 'en-gb',
  });

  blogPosts.forEach((post: any) => {
    const authors: Author[] = post.frontmatter.authors.map(
      (author: any): Author => {
        const link = author.twitter
          ? `https://twitter.com/${author.twitter}`
          : undefined;
        return {
          name: author.name,
          link,
        };
      },
    );

    const url = `${SITE_URL}/blog/posts/${post.slug}`;
    const item: Item = {
      title: post.frontmatter.title,
      id: url,
      link: url,
      description: post.frontmatter.excerpt as string,
      author: authors,
      date: new Date(post.frontmatter.date),
      image: {
        url: `${SITE_URL}${post.frontmatter.cover}`,
      },
      category: post.frontmatter.type,
      enclosure: {
        url: `${SITE_URL}${post.frontmatter.cover}`,
        type: 'image',
        length: 15026,
      },
      published: new Date(post.frontmatter.date),
    };
    feed.addItem(item);
  });
  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());
}
