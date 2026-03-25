import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

const cardsData = [
  {
    icon: '/icons/eye.svg',
    title: 'Introduction',
    body: 'Discover JSON Schema and its role in validating JSON data.',
    headerSize: 'medium',
    bodyTextSize: 'small',
    link: '/overview/what-is-jsonschema',
  },
  {
    icon: '/icons/compass.svg',
    title: 'Get started',
    body: 'New to JSON Schema? Learn the fundamentals of schema design.',
    headerSize: 'medium',
    bodyTextSize: 'small',
    link: '/learn',
  },
  {
    icon: '/icons/grad-cap.svg',
    title: 'Guides',
    body: 'Master advanced skills like validation through hands-on guides.',
    headerSize: 'medium',
    bodyTextSize: 'small',
    link: '/learn/guides',
  },
  {
    icon: '/icons/book.svg',
    title: 'Reference',
    body: 'Dive deep into JSON Schema keywords with clear explanations and examples.',
    headerSize: 'medium',
    bodyTextSize: 'small',
    link: '/understanding-json-schema',
  },
  {
    icon: '/icons/clipboard.svg',
    title: 'Specification',
    body: 'Explore the evolution of JSON Schema across different versions.',
    headerSize: 'medium',
    bodyTextSize: 'small',
    link: '/specification',
  },
];

export default function Welcome() {
  const newTitle = 'Welcome';
  const fileRenderType = 'tsx';
  const renderCards = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
      {cardsData.map((card) => (
        <Card
          key={card.title}
          icon={card.icon}
          title={card.title}
          body={card.body}
          headerSize='medium'
          bodyTextSize='small'
          link={card.link}
        />
      ))}
    </div>
  );
  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
        <meta
          name='description'
          content='JSON Schema - a declarative language for validating JSON documents'
        />
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p className='mt-4'>
        JSON Schema is a declarative language for annotating and validating the
        structure, constraints, and data types of JSON documents. It helps
        standardize and define expectations for JSON data.
      </p>
      <p className='mt-2'>
        Our documentation will guide you from the basics to advanced topics in
        defining and validating JSON data.
      </p>
      <p className='mt-4 font-bold text-[1.3rem]'>Explore the docs</p>
      {renderCards()}
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
