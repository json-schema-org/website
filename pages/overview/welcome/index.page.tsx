import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';

export default function Welcome() {
  const newTitle = 'Welcome';
  const data = [
    {
      title: 'Overview',
      summary:
        'Our Overview provides a high level view of the project, its benefits, the roadmap and other relevant details.',
      logo: '/icons/eye.svg',
      links: {
        lang: 'URL1',
        url: '/overview/what-is-jsonschema',
      },
    },
    {
      title: 'Getting Started',
      summary:
        'Our Getting Started guide walks you through the basics of JSON Schema.',
      logo: '/icons/compass.svg',
      links: {
        lang: 'URL1',
        url: '/learn/getting-started-step-by-step',
      },
    },
    {
      title: 'Reference',
      summary:
        'Our Reference teaches JSON Schema deeply from a beginner to the advanced level.',
      logo: '/icons/book.svg',
      links: {
        lang: 'URL1',
        url: '/learn/glossary',
      },
    },
    {
      title: 'Specification',
      summary:
        'Our Specification section documents all versions of JSON Schema specification.',
      logo: '/icons/clipboard.svg',
      links: {
        lang: 'URL1',
        url: '/specification',
      },
    },
    {
      title: 'Other Resources',
      summary:
        'Explore our different resources, books, articles, courses, videos, podcasts, and papers, we welcome you to enjoy them.',
      logo: '/icons/bookshelf.svg',
      links: {
        lang: 'URL1',
        url: '/resources/books',
      },
    },
  ];
  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        JSON Schema is a powerful tool for validating the structure of JSON
        data. It effectively helps you to annotate and validate the structure,
        constraints, and data types of your JSON documents. Our goal is to
        provide a standardized means for you to define the expectations of your
        JSON data.
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        {data.map((element: any, index: any) => (
          <Card
            key={index}
            title={element.title}
            body={element.summary}
            icon={element.logo}
            link={element.links.url}
          />
        ))}
      </div>
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
