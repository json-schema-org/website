import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { SectionContext } from '~/context';
import { Headline1 } from '~/components/Headlines';
import Card from '~/components/Card';
import data from '~/data/use-cases.json';

export default function Content() {
  const newTitle = 'Real-World Applications of JSON Schema';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        Welcome to the world of streamlined data! JSON Schema offers remarkable 
        capabilities for your projects. With the help of real-world examples, 
        you can see how this powerful tool simplifies data management, 
        ensures consistency, and facilitates seamless data exchange 
        across various applications. Learn how JSON Schema enables you 
        to construct robust data structures, ultimately saving time and reducing errors.
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-[10px] mx-auto mt-8'>
        {data.map((element, index) => (
          <Card
            key={index}
            title={element.title}
            body={element.summary}
            headerSize={'medium'}
            bodyTextSize={'small'}
          />
        ))}
      </div>
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;
