import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/SiteLayout';
import NewsletterForm from '~/components/Newsletter';
import { SectionContext } from '~/context';
import data from '../../data/newsletter.json';
import NewsletterCard from '~/components/NewsletterCard';

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
          <div className='mt-10'>
            <h2 className='text-xl'>Previous Newsletter</h2>
            <NewsletterCard newsletterData={data} />
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
