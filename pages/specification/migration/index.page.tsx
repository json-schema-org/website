import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticProps() {
  const index = fs.readFileSync(
    'pages/specification/migration/_index.md',
    'utf-8',
  );
  // const main = fs.readFileSync('pages/draft-05/release-notes.md', 'utf-8');
  const { content: indexContent, data: indexData } = matter(index);
  //  const { content: bodyContent } = matter(main);

  const frontmatter = { ...indexData };
  return {
    props: {
      blocks: {
        index: indexContent,
        //      body: bodyContent,
      },
      frontmatter,
    },
  };
}

export default function ImplementationsPages({
  blocks,
  frontmatter,
}: {
  blocks: any;
  frontmatter: any;
}) {
  const markdownFile = '_indexPage';
  return (
    <SectionContext.Provider value={null}>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={blocks.index} />
      <StyledMarkdown markdown={blocks.body} />
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          title='Draft 2019-09 to Draft 2020-12'
          body='Details for migrations from Draft 2019-09 to 2020-12.'
          headerSize='small'
          bodyTextSize='small'
          link='/draft/2020-12/release-notes'
        />
        <Card
          title='Draft-07 to Draft 2019-09'
          body='Details for migrations from Draft-07 to 2019-09.'
          headerSize='small'
          bodyTextSize='small'
          link='/draft/2019-09/release-notes'
        />
        <Card
          title='Draft-06 to Draft-07'
          body='Details for migrations from Draft-6 to Draft-07.'
          headerSize='small'
          bodyTextSize='small'
          link='/draft-07/json-schema-release-notes'
        />
        <Card
          title='Draft-05 to Draft-06'
          body='Details for migrations from Draft-05 to Draft-06.'
          headerSize='small'
          bodyTextSize='small'
          link='/draft-06/json-schema-release-notes'
        />
      </div>
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
