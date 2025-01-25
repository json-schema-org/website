import React from 'react';
import Head from 'next/head';
import StyledMarkdown from '~/components/StyledMarkdown';
import { getLayout } from '~/components/Sidebar';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { Headline1 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';
import { SectionContext } from '~/context';
import { TableOfContentMarkdown } from '~/components/TOC';

// Function to remove all HTML tags
const stripHtmlTags = (markdown: string) => {
  // Regular expression to remove all HTML tags
  const htmlTagRegex = /<\/?[^>]+(>|$)/g;
  return markdown.replace(htmlTagRegex, '');
};
import NextPrevButton from '~/components/NavigationButtons';

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/understanding-json-schema');
}
export async function getStaticProps(args: any) {
  return getStaticMarkdownProps(args, 'pages/understanding-json-schema');
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
  const sanitizedContent = stripHtmlTags(content);
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <div className='flex pt-4'>
        <div className='w-full pr-5'>
          <Head>
            <title>{newTitle}</title>
          </Head>
          <Headline1>{frontmatter.title || 'NO TITLE!'}</Headline1>
          <StyledMarkdown markdown={sanitizedContent} />
          <NextPrevButton
        prevLabel={frontmatter?.prev?.label}
        prevURL={frontmatter?.prev?.url}
        nextLabel={frontmatter?.next?.label}
        nextURL={frontmatter?.next?.url}
      />
          <DocsHelp markdownFile={markdownFile} />
        </div>
        <TableOfContentMarkdown markdown={sanitizedContent} depth={3} />
      </div>
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
