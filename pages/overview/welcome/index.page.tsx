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
        'Ut minim anim non deserunt veniam. Ex sit eu voluptate labore sunt aute ',
      logo: '/icons/eye.svg',
      links: {
        lang: 'URL1',
        url: '/overview/what-is-jsonschema',
      },
    },
    {
      title: 'Getting Started',
      summary:
        'Sit anim eu sunt nisi. Tempor cupidatat voluptate nostrud voluptate deserunt cupidatat dolor magna irure deserunt.',
      logo: '/icons/compass.svg',
      links: {
        lang: 'URL1',
        url: '/learn/getting-started-step-by-step',
      },
    },
    {
      title: 'Reference',
      summary:
        'Adipisicing minim ex amet occaecat dolore quis nisi voluptate sit.',
      logo: '/icons/book.svg',
      links: {
        lang: 'URL1',
        url: '/learn/glossary',
      },
    },
    {
      title: 'Specification',
      summary:
        'Deserunt et fugiat do adipisicing enim in nostrud Lorem anim ut amet enim.',
      logo: '/icons/clipboard.svg',
      links: {
        lang: 'URL1',
        url: '/specification',
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
        Veniam ea fugiat exercitation laboris non est nulla id pariatur ex. Qui
        occaecat fugiat sunt exercitation adipisicing culpa reprehenderit
        consectetur amet in. Qui fugiat amet do eu.
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
