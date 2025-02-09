import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';

export default function Welcome() {
  const fileRenderType = 'tsx';
  const newTitle = 'Get started';
  return (
    <SectionContext.Provider value='learn'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        New to JSON Schema and don't know where to start? Explore our learning
        resources and get started with JSON Schema.
        <br />
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          title='What is a Schema?'
          body='Let us start by defining what is a Schema'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/understanding-json-schema/about'
        />
        <Card
          title='JSON Schema basics'
          body='Learn what JSON Schema is, essential keywords, and the basics of data validation'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/understanding-json-schema/basics'
        />
        <Card
          title='Create your first schema'
          body='Follow our step by step guide and create your first JSON Schema'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/learn/getting-started-step-by-step'
        />
        <Card
          title='Tour of JSON Schema'
          body='Master JSON Schema through engaging lessons and hands-on exercises. Complete the course to earn your JSON Schema certification and prove your expertise.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://tour.json-schema.org/'
        />
        <Card
          title='JSON Schema glossary'
          body='Explore a curated glossary of common terms used in the JSON Schema ecosystem'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/learn/glossary'
        />
        <Card
          title='JSON Schema examples'
          body='Browse real-world JSON Schema examples across different domains, with detailed annotations.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/learn/miscellaneous-examples'
        />
      </div>
      <NextPrevButton
        prevLabel='Code of Conduct'
        prevURL='/overview/code-of-conduct'
        nextLabel='What is a Schema?'
        nextURL='/understanding-json-schema/about'
      />
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
