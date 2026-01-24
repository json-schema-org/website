/* eslint-disable linebreak-style */
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import { Headline1 } from '~/components/Headlines';
import { getLayout } from '~/components/SiteLayout';

// Dynamic import to avoid SSR issues with Monaco Editor
const SchemaValidator = dynamic(() => import('@/components/SchemaValidator'), {
  ssr: false,
});

export default function ValidatorPage() {
  return (
    <SectionContext.Provider value='tools'>
      <Head>
        <title>JSON Schema Validator - Interactive Tool</title>
        <meta
          name='description'
          content='Validate your JSON data against a JSON Schema interactively. Paste your schema and data to test validation in real-time.'
        />
      </Head>

      <div className='mx-auto w-full max-w-[1400px] min-h-screen flex flex-col items-center'>
        <div className='w-full px-4 md:px-12 mt-20'>
          <main className='w-full'>
            <Headline1>JSON Schema Validator</Headline1>
            <p className='text-slate-600 dark:text-slate-300 leading-7 pb-6'>
              Test your JSON data against a JSON Schema. Paste your schema in
              the left editor and your JSON data in the right editor, then click
              Validate to see the results.
            </p>

            <SchemaValidator />

            <div className='mt-8'>
              <DocsHelp />
            </div>
          </main>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ValidatorPage.getLayout = getLayout;
