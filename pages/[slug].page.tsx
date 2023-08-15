// import Layout from '~/components/Layout'
import { getLayout } from '../components/Sidebar'
import dynamic from 'next/dynamic'
const StyledMarkdown = dynamic(() => import('~/components/StyledMarkdown'))
import Head from 'next/head'
import React from 'react'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'
import { SectionContext } from '~/context'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages') }

export default function StaticMarkdownPage({ frontmatter, content }: { frontmatter: any, content: any }) {
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