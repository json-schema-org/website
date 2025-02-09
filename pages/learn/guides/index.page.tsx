import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';
import Card from '~/components/Card';

export default function Welcome() {
  const fileRenderType = 'tsx';

  const newTitle = 'Guides';
  return (
    <SectionContext.Provider value='learn'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
       Welcome to our new Guides section!
        <br />
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          title='For Implementers'
          body='Dive into the technical details of implementing JSON Schema'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/implementers'
        />
      </div>
      <NextPrevButton
        prevLabel='Other examples'
        prevURL='/learn/json-schema-examples'
        nextLabel='For Implementers'
        nextURL='/implementers'
      />
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
