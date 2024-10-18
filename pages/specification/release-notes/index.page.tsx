import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

interface StaticProps {
  blocks: {
    index: string;
    body?: string;
  };
  frontmatter: {
    title: string;
  };
}

export async function getStaticProps(): Promise<{ props: StaticProps }> {
  const index = fs.readFileSync(
    'pages/specification/release-notes/_index.md',
    'utf-8',
  );
  // const main = fs.readFileSync('pages/draft-05/release-notes.md', 'utf-8');
  const { content: indexContent, data: indexData } = matter(index);
  //  const { content: bodyContent } = matter(main);

  const frontmatter = { ...indexData, title: indexData.title || '' };
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

interface CardProps {
  title: string;
  body: string;
  headerSize: 'small';
  bodyTextSize: 'small';
  link: string;
}

const releaseNotes: CardProps[] = [
  {
    title: 'Draft 2020-12',
    body: 'Draft 2020-12 release notes.',
    headerSize: 'small',
    bodyTextSize: 'small',
    link: '/draft/2020-12/release-notes',
  },
  {
    title: 'Draft 2019-09',
    body: 'Draft 2019-09 release notes.',
    headerSize: 'small',
    bodyTextSize: 'small',
    link: '/draft/2019-09/release-notes',
  },
  {
    title: 'Draft 07',
    body: 'Draft 07 release notes.',
    headerSize: 'small',
    bodyTextSize: 'small',
    link: '/draft-07/json-schema-release-notes',
  },
  {
    title: 'Draft 06',
    body: 'Draft 06 release notes.',
    headerSize: 'small',
    bodyTextSize: 'small',
    link: '/draft-06/json-schema-release-notes',
  },
  {
    title: 'Draft 05',
    body: 'Draft 05 release notes.',
    headerSize: 'small',
    bodyTextSize: 'small',
    link: '/draft-05#explanation-for-lack-of-draft-05-meta-schema',
  },
];

export default function ImplementationsPages({
  blocks,
  frontmatter,
}: StaticProps) {
  const markdownFile = '_indexPage';
  return (
    <SectionContext.Provider value={null}>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={blocks.index} />
      {blocks.body && <StyledMarkdown markdown={blocks.body} />}
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        {releaseNotes.map((note, index) => (
          <Card
            key={index}
            title={note.title}
            body={note.body}
            headerSize={note.headerSize}
            bodyTextSize={note.bodyTextSize}
            link={note.link}
          />
        ))}
      </div>
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}

ImplementationsPages.getLayout = getLayout;
