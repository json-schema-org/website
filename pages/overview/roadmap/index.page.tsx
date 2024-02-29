import React from 'react'
import { getLayout } from '~/components/Sidebar'
import fs from 'fs'
import Head from 'next/head'
import { Headline1 } from '~/components/Headlines'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import { DocsHelp } from '~/components/DocsHelp'
import { SectionContext } from '~/context'

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/overview/roadmap/roadmap.md', 'utf-8')
  const { content: block1Content } = matter(block1)
  return {
    props: {
      blocks: [block1Content]
    }
  }
}

export default function ContentExample ({ blocks }: { blocks: any[] }) {
  const newTitle = 'Roadmap'

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <StyledMarkdown markdown={blocks[0]} />
      <DocsHelp />
    </SectionContext.Provider>
  )
}
ContentExample.getLayout = getLayout