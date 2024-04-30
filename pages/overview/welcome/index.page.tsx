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
        'Find everything you need to know about JSON Schema in one convenient place, including; sponsors, use cases, case studies, FAQ, code of conduct, etc. ',
      logo: '/icons/eye.svg',
      links: {
        lang: 'URL1',
        url: '/overview/what-is-jsonschema',
      },
    },
    {
      title: 'Getting Started',
      summary:
        'Here the magic begins! Get your project up and running with our tutorial. The section helps you start your journey toward creating a JSON schema document.',
      logo: '/icons/compass.svg',
      links: {
        lang: 'URL1',
        url: '/learn/getting-started-step-by-step',
      },
    },
    {
      title: 'Reference',
      summary:
        'Explore the JSON Schema reference. You have access to everything, the definition of common terms used in the JSON Schema (glossary), the schema reference, learning & understanding JSON Schema, and many more.',
      logo: '/icons/book.svg',
      links: {
        lang: 'URL1',
        url: '/learn/glossary',
      },
    },
    {
      title: 'Specification',
      summary:
        'Allows you to define validation, documentation, hyperlink navigation, and interaction control of JSON data.',
      logo: '/icons/clipboard.svg',
      links: {
        lang: 'URL1',
        url: '/specification',
      },
    },
    {
      title: 'Other Resources',
      summary:
        'Explore our different resources, books, articles, courses, videos, podcasts, papers, and we welcome you to enjoy them.',
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
Welcome to the place where simplicity meets power. The JSON Schema exists to empower you, help you build more, and break less. It is the fastest and most effective means to enable your JSON data implementations. So, jump right in and explore. With JSON Schema by your side, the possibilities are endless. Below you will find the pages from our documentation. Welcome aboard!
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
