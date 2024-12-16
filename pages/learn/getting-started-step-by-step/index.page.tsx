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
import { TableOfContentMarkdown } from '~/components/StyledMarkdown';
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
      <div className='flex'>
        <div className='w-full pr-5'>
          <Head>
            <title>{newTitle}</title>
          </Head>
          <Headline1>{newTitle}</Headline1>
          <StyledMarkdown markdown={blocks[0]} />
          <GettingStarted />
          <StyledMarkdown markdown={blocks[1]} />
          <DocsHelp />
        </div>

        <div className='w-2/5 lg:block mt-10 hidden sticky top-24 h-[calc(100vh-6rem)] overflow-hidden'>
          <div className='h-full overflow-y-auto scrollbar-hidden pl-5'>
            <div className='uppercase text-xs text-slate-400 mb-4'>
              On this page
            </div>
            <TableOfContentMarkdown markdown={blocks.join('\n')} depth={2} />
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

StyledValidator.getLayout = getLayout;
