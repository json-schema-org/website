import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import Head from 'next/head';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';

export async function getStaticProps() {
  const block = fs.readFileSync(
    'pages/overview/trademark-policy/_index.md',
    'utf-8',
  );
  const { content: blockContent } = matter(block);
  return {
    props: {
      blocks: [blockContent],
    },
  };
}

export default function Content({
  blocks,
}: {
  blocks: any[];
  frontmatter: any;
  content: any;
}) {
  const newTitle = 'Trademark Policy';
  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <StyledMarkdown markdown={blocks[0]} />
      <NextPrevButton
        prevLabel='Code of Conduct'
        prevURL='/overview/code-of-conduct'
        nextLabel='FAQ'
        nextURL='/overview/faq'
      />
      <DocsHelp />
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;
