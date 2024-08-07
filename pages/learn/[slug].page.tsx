import React from 'react';
import Head from 'next/head';
import StyledMarkdown from '~/components/StyledMarkdown';
import { getLayout } from '~/components/Sidebar';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { Headline2 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import { TableOfContentMarkdown } from '~/components/StyledMarkdown';

import NextPrevButton from '~/components/NextPrevButton';

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/learn');
}
export async function getStaticProps(args: any) {
  return getStaticMarkdownProps(args, 'pages/learn');
}

export default function StaticMarkdownPage({
  frontmatter,
  content,
}: {
  frontmatter: any;
  content: any;
}) {
  const markdownFile = '_index';
  const newTitle = 'JSON Schema - ' + frontmatter.title;
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div>
        <div className='flex flex-row gap-4'>
          <div className='flex gap-4 flex-col max-sm:w-full lg:w-2/3'>
            <Headline2>{frontmatter.title}</Headline2>

            <div className='lg:mr-4'>
              <StyledMarkdown markdown={content} />
            </div>
          </div>

          <div className='relative'>
            <div className='p-4 fixed h-1/2 mt-[55px] lg:block '>
              <div className='uppercase text-xs text-slate-400 mb-4 '>
                on this page
              </div>
              <TableOfContentMarkdown markdown={content} depth={0} />
            </div>
          </div>
        </div>
        <NextPrevButton prev={frontmatter.prev} next={frontmatter.next} />
      </div>

      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
