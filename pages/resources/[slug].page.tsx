import React from 'react'
import Head from 'next/head'
import StyledMarkdown from '~/components/StyledMarkdown'
import { getLayout } from '~/components/Sidebar'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'
import { SectionContext } from '~/context'
import { Remember } from '~/components/Remember'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages/resources') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages/resources') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  const newTitle = 'JSON Schema - ' + frontmatter.title
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
      <Remember />
    </SectionContext.Provider>
  )
}
StaticMarkdownPage.getLayout = getLayout