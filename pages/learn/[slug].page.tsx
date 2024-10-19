import React from 'react';
import Head from 'next/head';
import StyledMarkdown from '~/components/StyledMarkdown';
import { getLayout } from '~/components/Sidebar';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { Headline1 } from '~/components/Headlines';
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

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/learn');
}

export async function getStaticProps(args: StaticPropsArgs) {
  return getStaticMarkdownProps(args, 'pages/learn');
}

export default function StaticMarkdownPage({
  frontmatter,
  content,
}: {
  frontmatter: Frontmatter;
  content: string;
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
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}

StaticMarkdownPage.getLayout = getLayout;
