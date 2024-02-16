import React from 'react'
import { getLayout } from '~/components/Sidebar'
import fs from 'fs'
import Head from 'next/head'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import { SectionContext } from '~/context'

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/overview/code-of-conduct/_index.md', 'utf-8')
  const { content: block1Content } = matter(block1)
  return {
    props: {
      blocks: [block1Content]
    }
  }
}

export default function ContentExample ({ blocks }: { blocks: any[] }) {
  const newTitle = 'Code of Conduct'

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <StyledMarkdown markdown={blocks[0]} />
    </SectionContext.Provider>
  )
}
ContentExample.getLayout = getLayout