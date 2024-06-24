import React from 'react';
import fs from 'fs';

import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import GettingStarted from '~/components/GettingStarted';

export async function getStaticProps() {
  const block1 = fs.readFileSync(
    'pages/learn/getting-started-step-by-step/getting-started-step-by-step.md',
    'utf-8',
  );
  const block2 = fs.readFileSync(
    'pages/learn/getting-started-step-by-step/next-steps.md',
    'utf-8',
  );
  const { content: block1Content } = matter(block1);
  const { content: block2Content } = matter(block2);
  return {
    props: {
      blocks: [block1Content, block2Content],
    },
  };
}

export default function StyledValidator({ blocks }: { blocks: any[] }) {
  const newTitle = 'Creating your first schema';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <StyledMarkdown markdown={blocks[0]} />
      <GettingStarted />
      <StyledMarkdown markdown={blocks[1]} />
      <DocsHelp />
    </SectionContext.Provider>
  );
}
StyledValidator.getLayout = getLayout;
