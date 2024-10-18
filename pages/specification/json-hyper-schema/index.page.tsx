import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import { Headline1 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticProps() {
  const index = fs.readFileSync(
    'pages/specification/json-hyper-schema/_index.md',
    'utf-8',
  );
  // const main = fs.readFileSync('pages/draft-05/release-notes.md', 'utf-8');
  const { content: indexContent, data: indexData } = matter(index);
  //  const { content: bodyContent } = matter(main);

  return {
    props: {
      blocks: {
        index: indexContent,
        //      body: bodyContent,
      },
      frontmatter: indexData,
    },
  };
}

interface ImplementationsPagesProps {
  blocks: {
    index: string;
  };
  frontmatter: {
    title: string;
    type: string;
    Specification: string;
  };
}

export default function ImplementationsPages({
  blocks,
  frontmatter,
}: ImplementationsPagesProps) {
  const markdownFile = '_indexPage';
  return (
    <SectionContext.Provider value={null}>
      <Headline1>{frontmatter.title}</Headline1>
      <h1>{frontmatter.type}</h1>
      <h2>{frontmatter.Specification}</h2>

      <StyledMarkdown markdown={blocks.index} />
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
