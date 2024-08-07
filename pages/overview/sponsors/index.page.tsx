import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import Head from 'next/head';
import { Headline2 } from '~/components/Headlines';
import matter from 'gray-matter';
import StyledMarkdown, {
  TableOfContentMarkdown,
} from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/overview/sponsors/_index.md', 'utf-8');
  const { content: block1Content } = matter(block1);
  return {
    props: {
      blocks: [block1Content],
    },
  };
}

export default function ContentExample({ blocks }: { blocks: any[] }) {
  const newTitle = 'Sponsors';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div className='flex flex-row gap-4 lg:w-2/3'>
        <div className='flex gap-4 flex-col  max-sm:w-full'>
          <Headline2>{newTitle}</Headline2>

          <div className='lg:mr-4'>
            <StyledMarkdown markdown={blocks[0]} />
          </div>
        </div>

        <div className='relative '>
          <div className='p-4 fixed mt-[55px] lg:block '>
            <div className='uppercase text-xs text-slate-400 mb-4 '>
              on this page
            </div>
            <TableOfContentMarkdown markdown={blocks[0]} depth={0} />
          </div>
        </div>
      </div>
      <DocsHelp />
    </SectionContext.Provider>
  );
}
ContentExample.getLayout = getLayout;
