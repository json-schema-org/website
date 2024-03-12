import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import data from 'data/casestudies.json';
import Card from '~/components/Card';
export async function getStaticProps() {
  const block1 = fs.readFileSync(
    'pages/overview/casestudies/_index.md',
    'utf-8',
  );
  const { content: block1Content } = matter(block1);
  return {
    props: {
      blocks: [block1Content],
    },
  };
}

export default function ContentExample({ blocks }: { blocks: any[] }) {
  const newTitle = 'Casestudies';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <StyledMarkdown markdown={blocks[0]} />
      <div className='w-full lg:w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-[10px] mx-auto '>
        {data.map((element, index) => (
          <Card
            key={index}
            title='Card Title'
            body={element.summary}
            icon={element.logo}
            link={element.links.url}
          />
        ))}
      </div>
    </SectionContext.Provider>
  );
}
ContentExample.getLayout = getLayout;
