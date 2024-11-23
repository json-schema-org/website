import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/Sidebar';
import StyledMarkdown from '~/components/StyledMarkdown';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/overview');
}
export async function getStaticProps(args: any) {
  return getStaticMarkdownProps(args, 'pages/overview');
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
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
      <NextPrevButton
        prevLabel={frontmatter.prev?.label}
        prevURL={frontmatter.prev?.url}
        nextLabel={frontmatter.next.label}
        nextURL={frontmatter.next.url}
      />
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
