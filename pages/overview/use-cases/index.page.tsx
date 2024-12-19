import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { SectionContext } from '~/context';
import { Headline1 } from '~/components/Headlines';
import Card from '~/components/Card';
import data from '~/data/use-cases.json';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';

export default function Content() {
  const newTitle = 'Use Cases';
  const markdownFile = '_indexPage';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        Discover everything you can do with JSON Schema. This section presents
        the most common use cases for JSON Schema, but there may be many more
        applications waiting to be discovered.
      </p>
      <div className='w-full lg:w-full grid grid-cols-2 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        {data.map((element, index) => (
          <Card
            key={index}
            title={element.title}
            body={element.summary}
            icon='/icons/bulb2.svg'
            headerSize='medium'
            extended
            bodyTextSize='small'
          />
        ))}
      </div>
      <NextPrevButton
        prevLabel='Sponsors'
        prevURL='/overview/sponsors'
        nextLabel='Case Studies'
        nextURL='/overview/case-studies'
      />
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;
