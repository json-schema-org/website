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

export default function Content({
  blocks,
}: {
  blocks: any[];
  frontmatter: any;
  content: any;
}) {
  const newTitle = 'Code of Conduct';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <StyledMarkdown markdown={blocks[0]} />
      <NextPrevButton
        prevLabel='Similar-Technologies'
        prevURL='/overview/similar-technologies'
        nextLabel='What is JSON Schema'
        nextURL='/overview/what-is-jsonschema'
      />
      <DocsHelp />
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;
