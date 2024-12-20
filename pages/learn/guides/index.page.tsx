import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

export default function Welcome() {
  const markdownFile = '_indexPage';

  const newTitle = 'Guides';
  return (
    <SectionContext.Provider value='learn'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        Learn to build, combine, and validate schemas through hands-on
        exercises.
        <br />
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          title='Tour of JSON Schema'
          body='Master JSON Schema through engaging lessons and hands-on exercises. Complete the course to earn your JSON Schema certification and prove your expertise.'
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
