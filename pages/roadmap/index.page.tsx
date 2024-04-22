import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/Sidebar';
import NewsletterForm from '~/components/Newsletter';
import { SectionContext } from '~/context';
import Roadmap from '~/components/Roadmap';

export default function StaticMarkdownPage() {
  const newTitle = 'JSON Schema Roadmap';
  return (
    <SectionContext.Provider value={null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div className='flex flex-col items-center justify-center'>
        <div className='max-w-[1400px] mx-auto '>
          <Roadmap />
        </div>
      </div>
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
