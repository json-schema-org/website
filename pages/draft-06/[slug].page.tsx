import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/Sidebar';
import StyledMarkdown from '~/components/StyledMarkdown';
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import { Frontmatter } from '~/types/common';

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/draft-06');
}
export async function getStaticProps(args: { params?: { slug: string } }) {
  return getStaticMarkdownProps(args, 'pages/draft-06');
}

export default function StaticMarkdownPage({
  frontmatter,
  content,
}: {
  frontmatter: Frontmatter;
  content: string;
}) {
  const fileRenderType = '_md';
  const newTitle = 'JSON Schema - ' + frontmatter.title;

  return (
    <SectionContext.Provider value={frontmatter.section ?? null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
