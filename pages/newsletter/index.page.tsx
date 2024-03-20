import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/SiteLayout';
import NewsletterForm from '~/components/Newsletter';
import { SectionContext } from '~/context';

export default function StaticMarkdownPage() {
  const newTitle = 'JSON Schema Newsletter';
  return (
    <SectionContext.Provider value={null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div className='flex flex-col items-center justify-center'>
        <div className='max-w-[1400px] mx-auto'>
          <NewsletterForm
            className='pt-[100px] text-black'
            wrapperClassName='h-full sm:h-[calc(100vh-312px)] py-[50px] sm:py-0 px-5 sm:px-10 lg:w-full'
          />
        </div>
      </div>
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
