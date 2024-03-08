import fs from 'fs';

export default async function getStaticMarkdownPaths(path: string) {
  const files = fs.readdirSync(path);
  const paths = files
    .filter((file) => {
      const isMarkdownFile = file.substr(-3) === '.md';
      const isProtected = ['_'].includes(file.substr(0, 1));
      return isMarkdownFile && !isProtected;
    })
    .map((fileName) => ({
      params: {
        slug: fileName.replace('.md', ''),
      },
    }));
  return {
    paths,
    fallback: false,
  };
}
