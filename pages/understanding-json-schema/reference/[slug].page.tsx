import Layout from '~/components/Layout'
import { Headline1 } from '~/components/Headlines'
import StyledMarkdown from '~/components/StyledMarkdown'
import Head from 'next/head'
import React from 'react'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { SectionContext } from '~/context'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages/understanding-json-schema/reference') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages/understanding-json-schema/reference') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Layout>
        <Head>
          <title>JSON Schema - {frontmatter.title}</title>
        </Head>
        <Headline1>{frontmatter.title || 'NO TITLE!'}</Headline1>
        <StyledMarkdown markdown={content} />
      </Layout>
    </SectionContext.Provider>
  )
}
