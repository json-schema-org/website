import React from 'react';
import { getLayout } from '~/components/SiteLayout';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

export default function ProHelp() {
  const newTitle = 'Need hands-on help with JSON Schema?';
  return (
    <SectionContext.Provider value='pro-help'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div
        className='max-w-screen-xl block px-4 sm:px-6 lg:px-8 mt-12 mx-auto w-full'
        data-testid='pro-help'
      >
        <div className='mt-12'>
          <Headline1>{newTitle}</Headline1>
          <p>
            Whether you need custom training, personalized advice, or custom JSON Schema solutions, some members of the JSON Schema Technical Steering Committee and Ambassadors programs offer pro services beyond community support.
            <br />
            <br />
            <span className='font-bold text-[1.3rem]'>Available Members</span>
          </p>
          <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8 mb-8'>
            XXXX
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ProHelp.getLayout = getLayout;
