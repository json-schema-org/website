import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/SiteLayout';
import NewsletterForm from '~/components/Newsletter';
import { SectionContext } from '~/context';
import data from '../../data/newsletter.json';
import NewsletterCard from '~/components/NewsletterCard';

export default function StaticMarkdownPage () {
  const newTitle = 'JSON Schema Newsletter';
  return (
    <SectionContext.Provider value={null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div className='flex flex-col items-center justify-center'>
        <div className='max-w-[1400px] mx-auto'>
          <NewsletterForm
            className='pt-[150px] text-black'
            wrapperClassName='h-full sm:py-0 lg:w-full'
          />
          <div className='mt-10'>
            <h2 className='text-xl font-bold p-4 bg-gray-200 dark:bg-transparent'>
              Grouping by 2024
            </h2>
            <NewsletterCard newsletterData={data} />
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
