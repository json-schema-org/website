import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/Sidebar';
import { Headline1 } from '~/components/Headlines';
import StyledMarkdown from '~/components/StyledMarkdown';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import { TableOfContentMarkdown } from '~/components/StyledMarkdown';

const stripHtmlTags = (markdown: string) => {
  const htmlTagRegex = /<\/?[^>]+(>|$)/g;
  return markdown.replace(htmlTagRegex, ''); // Remove HTML tags
};

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/understanding-json-schema/reference');
}

export async function getStaticProps(args: any) {
  return getStaticMarkdownProps(
    args,
    'pages/understanding-json-schema/reference',
  );
}

export default function StaticMarkdownPage({
  frontmatter,
  content,
}: {
  frontmatter: any;
  content: any;
}) {
  const newTitle = 'JSON Schema - ' + frontmatter.title;
  const markdownFile = '_index';

  const sanitizedContent = stripHtmlTags(content);
  console.log('sanitizedContent', sanitizedContent);

  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <div className='flex pt-4'>
        <div className='w-full pr-5'>
          <Head>
            <title>{newTitle}</title>
          </Head>
          <Headline1>{frontmatter.title || 'NO TITLE!'}</Headline1>
          <StyledMarkdown markdown={sanitizedContent} />
          <DocsHelp markdownFile={markdownFile} />
        </div>
        <div className='w-2/5 lg:block mt-10 hidden sticky top-24 h-[calc(100vh-6rem)] overflow-hidden'>
          <div className='h-full overflow-y-auto scrollbar-hidden pl-5'>
            <div className='uppercase text-xs text-slate-400 mb-4'>
              On this page
            </div>
            <TableOfContentMarkdown markdown={sanitizedContent} depth={3} />
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

StaticMarkdownPage.getLayout = getLayout;
