import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import Head from 'next/head';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';

export async function getStaticProps() {
  const block = fs.readFileSync(
    'pages/overview/code-of-conduct/_index.md',
    'utf-8',
  );
  const { content: blockContent } = matter(block);
  return {
    props: {
      blocks: [blockContent],
    },
  };
}

export default function Content({ blocks }: { blocks: any[] }) {
  const newTitle = 'Code of Conduct';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <StyledMarkdown markdown={blocks[0]} />
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;
