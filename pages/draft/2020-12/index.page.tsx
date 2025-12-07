import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import DocTable from '~/components/DocTable';
import { Headline1 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';
import { Frontmatter } from '~/types/common';

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

interface DraftFrontmatter extends Frontmatter {
  Specification?: string;
  Published?: string;
  Metaschema?: string;
}

interface BlocksData {
  index: string;
}

export default function ImplementationsPages({
  blocks,
  frontmatter,
}: {
  blocks: BlocksData;
  frontmatter: DraftFrontmatter;
}) {
  const fileRenderType = 'indexmd';
  return (
    <SectionContext.Provider value={null}>
      <Headline1>{frontmatter.title}</Headline1>
      <DocTable frontmatter={frontmatter} />
      <StyledMarkdown markdown={blocks.index} />
      <NextPrevButton
        prevLabel={frontmatter?.prev?.label}
        prevURL={frontmatter?.prev?.url}
        nextLabel={frontmatter?.next?.label}
        nextURL={frontmatter?.next?.url}
      />
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
