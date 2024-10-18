import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import DocTable from '~/components/DocTable';
import { Headline1 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticProps() {
  const index = fs.readFileSync('pages/draft/2020-12/index.md', 'utf-8');
  const { content: indexContent, data: indexData } = matter(index);

  const frontmatter = { ...indexData };
  return {
    props: {
      blocks: {
        index: indexContent,
      },
      frontmatter,
    },
  };
}

interface ImplementationsPagesProps {
  blocks: {
    index: string;
  };
  frontmatter: {
    title: string;
    Specification: string;
    Published: string;
    authors: string[];
    Metaschema: string;
  };
}

export default function ImplementationsPages({
  blocks,
  frontmatter,
}: ImplementationsPagesProps) {
  return (
    <SectionContext.Provider value={null}>
      <Headline1>{frontmatter.title}</Headline1>
      <DocTable frontmatter={frontmatter} />
      <StyledMarkdown markdown={blocks.index} />
      <DocsHelp />
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
