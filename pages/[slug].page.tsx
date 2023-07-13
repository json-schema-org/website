import Layout from '~/components/Layout'
import StyledMarkdown from '~/components/StyledMarkdown'
import Head from 'next/head'
import React from 'react'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'
import { SectionContext } from '~/context'
import { DocsNav } from '~/components/Layout'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages') }

export default function StaticMarkdownPage({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Layout>
        <Head>
          <title>JSON Schema - {frontmatter.title}</title>
        </Head>
        <div className='mt-12'>
          <div className='mx-auto grid grid-cols-4 px-2 sm:px-4 lg:px-8'>
            <div className='mt-6'><DocsNav /></div>
            <div className='col-span-4 md:col-span-3 mt-20 w-5/6'>
              <Headline1>{frontmatter.title}</Headline1>
              <StyledMarkdown markdown={content} />
            </div>
          </div>
        </div>
      </Layout>
    </SectionContext.Provider>
  )
}
