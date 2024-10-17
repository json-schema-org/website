import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

export default function Welcome() {
  const newTitle = 'Welcome';
  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        JSON Schema is a declarative language for annotating and validating JSON
        documents' structure, constraints, and data types. It provides a way to
        standardize and define expectations for JSON data.
        <br />
        <br />
        <span className='font-bold text-[1.3rem]'>Explore the docs</span>
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          icon='/icons/eye.svg'
          title='Overview'
          body='Our Overview provides a high level view of the project, its benefits, the roadmap and other relevant details.'
          headerSize='medium'
          bodyTextSize='small'
          link='/overview/what-is-jsonschema'
        />
        <Card
          icon='/icons/compass.svg'
          title='Getting Started'
          body='Our Getting Started guide walks you through the basics of JSON Schema.'
          headerSize='medium'
          bodyTextSize='small'
          link='/learn'
        />
        <Card
          icon='/icons/book.svg'
          title='Reference'
          body='Our Reference teaches JSON Schema deeply from a beginner to the advanced level.'
          headerSize='medium'
          bodyTextSize='small'
          link='/understanding-json-schema'
        />
        <Card
          icon='/icons/clipboard.svg'
          title='Specification'
          body='Our Specification section documents all versions of JSON Schema specification.'
          headerSize='medium'
          bodyTextSize='small'
          link='/specification'
        />
      </div>
      <DocsHelp />
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
