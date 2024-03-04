import fs from 'fs';
import matter from 'gray-matter';

export default async function getStaticPropsFromSingleMarkdown(path: string) {
  const contentMarkdown = fs.readFileSync(path, 'utf-8');
  const { content } = matter(contentMarkdown);
  return { props: { content } };
}
