import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import data from '~/data/welcome.json';

export default function Welcome() {
  const newTitle = 'Welcome';
  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        JSON Schema is a powerful standard for validating the structure of JSON
        data. It effectively helps you to annotate and validate the structure,
        constraints, and data types of your JSON documents. Our goal is to
        provide a standardized means for you to define the expectations of your
        JSON data.
        <br />
        <br />
        <span className='font-bold text-[1.3rem]'>Explore the docs</span>
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        {data.map((element: any, index: any) => (
          <Card
            key={index}
            title={element.title}
            body={element.summary}
            icon={element.icon}
            link={element.links.url}
          />
        ))}
      </div>
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
