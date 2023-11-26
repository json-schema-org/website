import React from 'react'
import { getLayout } from '~/components/Sidebar'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import { DocsHelp } from '~/components/DocsHelp'
import { SectionContext } from '~/context'
import { Headline1 } from '~/components/Headlines'
import Head from 'next/head'


export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/overview/sponsors.md', 'utf-8')

  const { data: frontmatter, content } = matter(block1)

  return {
    props: {
      frontmatter,
      content,
    }
  }
}

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  const newTitle = 'JSON Schema - ' + frontmatter.title

  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{frontmatter.title}</Headline1>
      <StyledMarkdown markdown={content} />
      <DocsHelp />
    </SectionContext.Provider>
  )
}
StaticMarkdownPage.getLayout = getLayout