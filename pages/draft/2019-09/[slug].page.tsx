import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/Sidebar';
import StyledMarkdown from '~/components/StyledMarkdown';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/draft/2019-09');
}

interface StaticPropsArgs {
  params: {
    slug: string;
  };
}

export async function getStaticProps(args: StaticPropsArgs) {
  return getStaticMarkdownProps(args, 'pages/draft/2019-09');
}

interface Frontmatter {
  title: string;
  section?:
    | 'learn'
    | 'docs'
    | 'implementers'
    | 'tools'
    | 'implementations'
    | 'blog'
    | 'community'
    | 'specification'
    | 'overview'
    | 'getting-started'
    | 'reference'
    | null;
}

interface StaticMarkdownPageProps {
  frontmatter: Frontmatter;
  content: string;
}

export default function StaticMarkdownPage({
  frontmatter,
  content,
}: StaticMarkdownPageProps) {
  const markdownFile = '_index';
  const newTitle = 'JSON Schema - ' + frontmatter.title;

  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
