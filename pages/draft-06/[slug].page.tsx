import React from 'react'
import Head from 'next/head'
import { getLayout } from '~/components/Sidebar'
import StyledMarkdown from '~/components/StyledMarkdown'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'
import { SectionContext } from '~/context'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages/draft-06') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages/draft-06') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Head>
        <title>JSON Schema - {frontmatter.title}</title>
      </Head>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
    </SectionContext.Provider>
  )
}
StaticMarkdownPage.getLayout = getLayout