import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { DocsHelp } from '~/components/DocsHelp';
import { SectionContext } from '~/context';

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/implementers/_index.md', 'utf-8');
  const { content: block1Content } = matter(block1);
  return {
    props: {
      blocks: [block1Content],
    },
  };
}

export default function ContentExample({ blocks }: { blocks: any[] }) {
  return (
    <SectionContext.Provider value='docs'>
      <StyledMarkdown markdown={blocks[0]} />
      <DocsHelp />
    </SectionContext.Provider>
  );
}
ContentExample.getLayout = getLayout;
