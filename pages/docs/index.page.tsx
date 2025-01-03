import React from 'react';
import Head from 'next/head';
// import PropTypes from 'prop-types';
import { getLayout } from '~/components/Sidebar';
import { Headline1 } from '~/components/Headlines';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';
import { SectionContext } from '~/context';

const CARDS_DATA = [
  {
    icon: '/icons/eye.svg',
    title: 'Overview',
    body: 'Our Overview provides a high level view of the project, its benefits, the roadmap and other relevant details.',
    link: '/overview/what-is-jsonschema',
  },
  {
    icon: '/icons/compass.svg',
    title: 'Getting Started',
    body: 'Our Getting Started guide walks you through the basics of JSON Schema.',
    link: '/learn',
  },
  {
    icon: '/icons/book.svg',
    title: 'Reference',
    body: 'Our Reference teaches JSON Schema deeply from a beginner to the advanced level.',
    link: '/understanding-json-schema',
  },
  {
    icon: '/icons/clipboard.svg',
    title: 'Specification',
    body: 'Our Specification section documents all versions of JSON Schema specification.',
    link: '/specification',
  },
];

export default function Welcome() {
  const PAGE_TITLE = 'Welcome';

  const renderCards = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
      {CARDS_DATA.map((card) => (
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
        <title>{PAGE_TITLE}</title>
        <meta
          name='description'
          content='Learn about JSON Schema - a declarative language for validating JSON documents'
        />
      </Head>

      <Headline1>{PAGE_TITLE}</Headline1>

      <p className='mb-6'>
        JSON Schema is a declarative language for annotating and validating JSON
        documents' structure, constraints, and data types. It provides a way to
        standardize and define expectations for JSON data.
      </p>

      <h2 className='font-bold text-xl mb-4'>Explore the docs</h2>

      {renderCards()}

      <DocsHelp />
    </SectionContext.Provider>
  );
}

//layout configuration
Welcome.getLayout = getLayout;

//display name for better debugging
Welcome.displayName = 'Welcome';
