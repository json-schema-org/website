import React from 'react'
import Head from 'next/head'
import { getLayout } from '~/components/Sidebar'
import { Headline1 } from '~/components/Headlines'
import dynamic from 'next/dynamic'
const StyledMarkdown = dynamic(() => import('~/components/StyledMarkdown'))
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { SectionContext } from '~/context'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages/understanding-json-schema/reference') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages/understanding-json-schema/reference') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Head>
        <title>JSON Schema - {frontmatter.title}</title>
      </Head>
      <Headline1>{frontmatter.title || 'NO TITLE!'}</Headline1>
      <StyledMarkdown markdown={content} />
    </SectionContext.Provider>
  )
}
StaticMarkdownPage.getLayout = getLayout