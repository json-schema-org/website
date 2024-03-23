import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { SectionContext } from '~/context';
import { Headline1 } from '~/components/Headlines';
import Card from '~/components/Card'
import data from '~/data/use-cases.json'

export default function Content() {
  const newTitle = 'Use Cases';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
      Welcome to the land of streamlined data! JSON Schema unlocks incredible potential for all your projects. Explore real-world applications showcasing how this powerful tool simplifies data management, ensures consistency, and fosters seamless data exchange across applications. See how JSON Schema empowers you to build robust data structures, saving time and minimizing errors. 
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-[10px] mx-auto mt-8'>
        {data.map((element, index) => (
          <Card
            key={index}
            title={element.title}
            body={element.summary}
            link={element.links.url}
            headerSize={"medium"}
            bodyTextSize={"small"}
          />
        ))}
      </div>
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;