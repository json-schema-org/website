import fs from 'fs';
import matter from 'gray-matter';

type Props = { params?: { slug: string } };

interface Frontmatter {
  [key: string]: unknown;
}

export default async function getStaticMarkdownProps(
  props: Props,
  path: string,
): Promise<{
  props: {
    frontmatter: Frontmatter;
    content: string;
  };
}> {
  const slug = props.params?.slug || '_index';

  const fileName2 = `${path}/${slug}.md`;
  const fileName = fs.readFileSync(fileName2, 'utf-8');

  const { data: frontmatter, content } = matter(fileName);

  return {
    props: {
      frontmatter: frontmatter as Frontmatter,
      content,
    },
  };
}
