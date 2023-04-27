import React from 'react'
import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import { SectionContext } from '~/context'

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/understanding-json-schema/_index.md', 'utf-8')
  const { content: block1Content } = matter(block1)
  return {
    props: {
      blocks: [block1Content]
    }
  }
}

export default function ContentExample ({ blocks }: { blocks: any[] }) {
  return (
    <SectionContext.Provider value='docs'>
      <Layout>
        <StyledMarkdown markdown={blocks[0]} />
      </Layout>
    </SectionContext.Provider>
  )
}
