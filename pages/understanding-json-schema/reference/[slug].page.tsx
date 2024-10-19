import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/Sidebar';
import { Headline1 } from '~/components/Headlines';
import StyledMarkdown from '~/components/StyledMarkdown';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';

interface StaticPropsArgs {
  params: {
    slug: string;
  };
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

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/understanding-json-schema/reference');
}

export async function getStaticProps(args: StaticPropsArgs) {
  return getStaticMarkdownProps(
    args,
    'pages/understanding-json-schema/reference',
  );
}

export default function StaticMarkdownPage({
  frontmatter,
  content,
}: StaticMarkdownPageProps) {
  const newTitle = `JSON Schema - ${frontmatter.title}`;
  const markdownFile = '_index';

  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{frontmatter.title || 'NO TITLE!'}</Headline1>
      <StyledMarkdown markdown={content} />
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}

StaticMarkdownPage.getLayout = getLayout;
