import Layout from '~/components/Layout'
import { Headline1 } from '~/components/Headlines'
import fs from 'fs'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import matter from 'gray-matter'
import readingTime from 'reading-time'
const path = 'pages/blog/posts'
import TextTruncate from 'react-text-truncate'

export async function getStaticProps() {
  const files = fs.readdirSync(path)
  const blogPosts = files
    .filter(file => file.substr(-3) === '.md')
    .map((fileName) => {
      const slug = fileName.replace('.md', '')
      const fullFileName = fs.readFileSync(`pages/blog/posts/${slug}.md`, 'utf-8')
      const { data: frontmatter, content } = matter(fullFileName)
      return ({
        slug: slug,
        frontmatter,
        content
      })
    })

  return {
    props: {
      blogPosts
    }
  }
}

export default function StaticMarkdownPage ({ blogPosts }: { blogPosts: any[] }) {
  return (
    <Layout>
      <Head>
        <title>JSON Schema Blog</title>
      </Head>
      <Headline1>Blog</Headline1>
      <div className='grid grid-cols-3 gap-4 grid-flow-row mb-20'>
        {blogPosts
          .sort((a, b) => {
            const dateA = new Date(a.frontmatter.date).getTime()
            const dateB = new Date(b.frontmatter.date).getTime()
            return dateA < dateB ? 1 : -1
          })
          .map((blogPost: any) => {
            const { frontmatter, content } = blogPost
            const date = new Date(frontmatter.date)

            const timeToRead = Math.ceil(readingTime(content).minutes)

            return (
              <div
                key={blogPost.slug}
                className='flex border rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden'
              >
                <Link href={`/blog/posts/${blogPost.slug}`}>
                  <a className='inline-flex flex-col flex-1 w-full'>
                    <div
                      className='bg-slate-50 h-[160px] w-full self-stretch mr-3 bg-cover bg-center'
                      style={{ backgroundImage: `url(${frontmatter.cover})` }}
                    />
                    <div className='p-4 flex flex-col flex-1 justify-between'>
                      <div>
                        <div>
                          <div className='bg-blue-100 font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 text-sm'>
                            {frontmatter.type}
                          </div>
                        </div>
                        <div className='text-lg font-semibold'>
                          {frontmatter.title}
                        </div>
                        <div className='mt-3 mb-6 text-slate-500'>
                          <TextTruncate element='span' line={4} text={frontmatter.excerpt} />
                        </div>
                      </div>
                      <div className='flex flex-row items-center'>
                        <div className='flex flex-row pl-2 mr-2'>
                          {(frontmatter.authors || []).map((author: any, index: number) => {
                            return (
                              <div
                                key={index}
                                className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                                style={{ backgroundImage: `url(${author.photo})`, zIndex: 100 - index }}
                              />
                            )
                          })}
                        </div>

                        <div className='flex flex-col items-start'>
                          <div className='text-sm font-semibold'>
                            {(frontmatter.authors.map((author: any) => author.name).join(' & '))}
                          </div>

                          <div className='text-slate-500 text-sm'>
                            {frontmatter.date && (
                              <span>
                                {date.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            )} &middot; {timeToRead} min read
                          </div>
                        </div>

                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            )
          }
          )}
      </div>
    </Layout>
  )
}
