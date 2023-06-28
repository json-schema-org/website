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

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Layout>
        <Head>
          <title>JSON Schema - {frontmatter.title}</title>
        </Head>
        <div className='bg-slate-100 mt-12'>
          <div className='flex flex-row justify-between gap-12 bg-white xl:w-[1200px] mx-auto px-2 sm:px-4 lg:px-8'>
            <div className='mt-6'><DocsNav /></div>
            <div>
              <Headline1>{frontmatter.title}</Headline1>
              <StyledMarkdown markdown={content} />
            </div>
          </div>
        </div>
      </Layout>
    </SectionContext.Provider>
  )
}
