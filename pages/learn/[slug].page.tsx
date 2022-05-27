import { LayoutDocs } from '~/components/Layout'
import StyledMarkdown from '~/components/StyledMarkdown'
import Head from 'next/head'
import React from 'react'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages/learn') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages/learn') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <LayoutDocs>
      <Head>
        <title>JSON Schema - {frontmatter.title}</title>
      </Head>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
    </LayoutDocs>
  )
}
