import React from 'react';
import Head from 'next/head';
import StyledMarkdown from '~/components/StyledMarkdown';
import { getLayout } from '~/components/Sidebar';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import { TableOfContentMarkdown } from '~/components/TOC';
export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/draft-07');
}
export async function getStaticProps(args: any) {
  return getStaticMarkdownProps(args, 'pages/draft-07');
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
      <div className='flex pt-4'>
        <div className='w-full pr-5'>
          <Head>
            <title>{newTitle}</title>
          </Head>
          <Headline1>{frontmatter.title}</Headline1>
          <StyledMarkdown markdown={content} />
          <DocsHelp markdownFile={markdownFile} />
        </div>
        <TableOfContentMarkdown markdown={content} depth={3} />
      </div>
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
