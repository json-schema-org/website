import Layout from '~/components/Layout'
import StyledMarkdown, { TableOfContentMarkdown } from '~/components/StyledMarkdown'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import readingTime from 'reading-time'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages/blog/posts') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages/blog/posts') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  const date = new Date(frontmatter.date)
  const headlines = content
    .split('\n')
    .filter((line: string) => line.indexOf('## ') === 0 || line.indexOf('# ') === 0)

  const timeToRead = Math.ceil(readingTime(content).minutes)

  return (
    <Layout>
      <Head>
        <title>{frontmatter.title}</title>
      </Head>
      <div className='flex flex-col py-12'>
        {frontmatter.date && (
          <div className='text-center text-sm text-slate-500'>
            {date.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} &middot; {timeToRead} min read
          </div>
        )}
        <h1 className='font-bold text-4xl text-center mt-3 px-10'>{frontmatter.title}</h1>
      </div>

      <div className='relative flex flex-row'>
        <div className='flex w-[320px] px-4 pr-8'>
          <div className='block -mt-4 w-full'>
            <div className='sticky top-0 overflow-y-auto h-auto pt-4 w-full'>
              <Link href='/blog'>
                <a className='font-semibold text-sm pb-5 text-slate-700 hover:text-slate-800 inline-flex flex-row items-center'>
                  <img src='/icons/left-arrow.svg' className='h-4 w-4 mr-2' /> Go back to blog</a>
              </Link>
              <div className='pt-6 border-t border-slate-100 pr-4 border-r border-slate-100'>
                {(frontmatter.authors || []).map((author: any, index: number) => {
                  return (
                    <div key={index} className='flex flex-row items-center'>
                      <div
                        className='bg-slate-50 h-[44px] w-[44px] rounded-full mr-3 bg-cover bg-center'
                        style={{ backgroundImage: `url(${author.photo})` }}
                      />
                      <div>
                        <div className='text-sm font-semibold'>{author.name}</div>
                        {author.twitter && (
                          <a className='block text-sm text-blue-500 font-medium' href={`https://twitter.com/${author.twitter}`}>
                            @{author.twitter}
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='pt-12 pr-4 border-r border-slate-100'>
                <div className='uppercase text-xs text-slate-400 mb-4'>on this page</div>
                {headlines.map((headline: any, index: number) => {
                  return (
                    <div key={index}>
                      <TableOfContentMarkdown markdown={headline} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
        <div className='flex-1'>
          <div
            className='bg-slate-50 h-[400px] w-full rounded-lg mr-3 bg-cover mb-10 bg-center'
            style={{ backgroundImage: `url(${frontmatter.cover})` }}
          />
          <StyledMarkdown markdown={content} />
        </div>
      </div>

    </Layout>
  )
}
