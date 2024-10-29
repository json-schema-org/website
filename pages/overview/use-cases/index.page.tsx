import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { SectionContext } from '~/context';
import { Headline1 } from '~/components/Headlines';
import Card from '~/components/Card';
import data from '~/data/use-cases.json';
import { DocsHelp } from '~/components/DocsHelp';

export default function Content() {
  const newTitle = 'Use Cases';
  const markdownFile = 'tsx';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        Discover everything you can do with JSON Schema. This section presents
        the most common use cases for JSON Schema, but but there may be many
        more applications waiting to be discovered.
      </p>
      <div className='w-full lg:w-full grid grid-cols-2 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        {data.map((element, index) => (
          <Card
            key={index}
            title={element.title}
            body={element.summary}
            icon='/icons/bulb2.svg'
            headerSize={'medium'}
            extended={true}
            bodyTextSize={'small'}
          />
        ))}
      </div>
      <DocsHelp fileRenderType={markdownFile} />
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;
