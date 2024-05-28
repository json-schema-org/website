import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import data from 'data/case-studies.json';
import Card from '~/components/Card';

export default function ContentExample() {
  const newTitle = 'Case Studies';
  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p className='text-[18px]'>
        {/* Please fix below dummy text and make it two to three liner so that we can remove the bug of layout shifting :) */}
        Learn how organizations are adopting and benefiting from JSON Schema.
        Please replace this text with a two to three liner so that we can avoid
        the layout shifting bug.
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        {data.map((element, index) => (
          <Card
            key={index}
            title={element.title}
            body={element.summary}
            image={element.logo}
            extended={true}
            link={element.links.url}
          />
        ))}
      </div>
    </SectionContext.Provider>
  );
}
ContentExample.getLayout = getLayout;
