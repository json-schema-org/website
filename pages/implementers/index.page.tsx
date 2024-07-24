import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { DocsHelp } from '~/components/DocsHelp';
import { SectionContext } from '~/context';
import Card from '~/components/Card';

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/implementers/_index.md', 'utf-8');
  const { content: block1Content } = matter(block1);
  return {
    props: {
      blocks: [block1Content],
    },
  };
}

export default function ContentExample({ blocks }: { blocks: any[] }) {
  const markdownFile = '_indexPage';

  return (
    <SectionContext.Provider value='docs'>
      <StyledMarkdown markdown={blocks[0]} />
      <section className='mt-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12 m-auto'>
          <Card
            key='common-interfaces'
            icon='/icons/list.svg'
            title='Common Interfaces'
            body='Common Interfaces across JSON Schema Implementations'
            headerSize='small'
            bodyTextSize='small'
            link='./implementers/interfaces'
          />
          <Card
            key='bowtie'
            icon='/img/logos/bowtie.svg'
            title='Bowtie'
            body='The meta-validator for JSON Schema implementations'
            headerSize='medium'
            bodyTextSize='small'
            link='https://docs.bowtie.report/en/stable/'
          />
        </div>
      </section>
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
ContentExample.getLayout = getLayout;
