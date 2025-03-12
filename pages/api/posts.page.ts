import fs from 'fs';
import matter from 'gray-matter';
import type { NextApiRequest, NextApiResponse } from 'next';

const PATH = 'pages/blog/posts';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, type = 'All' } = req.query;
  const POSTS_PER_PAGE = 10;

  try {
    const files = fs.readdirSync(PATH);
    const blogPosts = files
      .filter((file) => file.substr(-3) === '.md')
      .map((fileName) => {
        const slug = fileName.replace('.md', '');
        const fullFileName = fs.readFileSync(`${PATH}/${slug}.md`, 'utf-8');
        const { data: frontmatter, content } = matter(fullFileName);
        return {
          slug: slug,
          frontmatter,
          content,
        };
      })
      .filter((post) => {
        if (type === 'All') return true;
        return post.frontmatter.type === type;
      })
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime();
        const dateB = new Date(b.frontmatter.date).getTime();
        return dateB - dateA;
      });

    const startIndex = (Number(page) - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = blogPosts.slice(startIndex, endIndex);

    res.status(200).json({
      posts: paginatedPosts,
      totalPosts: blogPosts.length,
      hasMore: endIndex < blogPosts.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error loading posts' });
  }
}
