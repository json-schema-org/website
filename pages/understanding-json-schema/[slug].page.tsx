import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const StyledMarkdown = dynamic(() => import('~/components/StyledMarkdown'))
import { getLayout } from '~/components/Sidebar'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'


export async function getStaticPaths() { return getStaticMarkdownPaths('pages/understanding-json-schema') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages/understanding-json-schema') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return ( 
    <div>
      <Head>
        <title>JSON Schema - {frontmatter.title}</title>
      </Head>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
    </div>
  )
}
StaticMarkdownPage.getLayout = getLayout
