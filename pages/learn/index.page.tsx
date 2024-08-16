import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

export default function Welcome() {
  const markdownFile = '_indexPage';

  const newTitle = 'Getting Started';
  return (
    <SectionContext.Provider value='learn'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        New to JSON Schema and don't know where to start?
        <br />
        <br />
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          title='Creating your first Schema'
          body='Our Getting Started guide walks you through the basics of JSON Schema.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/learn/getting-started-step-by-step'
        />
        <Card
          title='Tour of JSON Schema'
          body='An interactive introduction to JSON Schema. Each lesson concludes with an exercise, so you can practice what you have learned.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://tour.json-schema.org/'
        />
      </div>
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
