import React from 'react'
import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import Link from 'next/link'
import {Headline2} from '~/components/Headlines'

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/_index.md', 'utf-8')
  const { content: block1Content } = matter(block1)
  return {
    props: {
      blocks: [block1Content]
    }
  }
}

const Home = ({ blocks }: { blocks: any[] }) => {
  return (
    <Layout
      mainClassName='flex flex-col'
      hideAds
    >
      <div className='flex flex-col items-center'>
        <div
          className='py-[220px] bg-no-repeat bg-center bg-cover -mt-4 -mx-1 sm:-mx-4'
          style={{ backgroundImage: 'url("/img/stage-bg.svg")' }}
        >
          <h1 className='text-5xl font-black text-center'>
            Describe and validate JSON documents
          </h1>
          <h2 className='text-center text-lg text-slate-600 mt-6 max-w-4xl'>
            JSON schema is the standard vocabulary for describing JSON data.<br />It validates documents and provides a clear human- and machine- readable documentation.
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 w-full gap-4'>
          <Link href='/learn/getting-started-step-by-step'>
            <a className='p-4 text-center block border flex flex-col items-center justify-center h-40 rounded-2xl hover:shadow-md transition-shadow text-lg font-semibold'>
              <div className='text-5xl mb-2'>
                👋
              </div>
              Getting started
            </a>
          </Link>
          <Link href='/learn/getting-started-step-by-step'>
            <a className='p-4 text-center block border flex flex-col items-center justify-center h-40 rounded-2xl hover:shadow-md transition-shadow text-lg font-semibold'>
              <div className='text-5xl mb-2'>
                <img src='/img/logos/slack.svg' className='h-12 w-12' />
              </div>
              Open JSON Schema Slack
            </a>
          </Link>
          <a
            href='https://github.com/json-schema-org/community/discussions'
            className='p-4 text-center block border flex flex-col items-center justify-center h-40 rounded-2xl hover:shadow-md transition-shadow text-lg font-semibold'
          >
            <div className='text-5xl mb-2'>
              💬
            </div>
            GitHub Community Discussions
          </a>
        </div>
      </div>


      <Headline2>
        Regular activities
      </Headline2>
      <p className='text-slate-600 block leading-7 pb-4'>
        We hold weekly Office Hours and twice monthly Open Community Working Meetings.
      </p>
      <div className='flex flex-col sm:flex-row py-4'>
        <a
          href='https://github.com/json-schema-org/community/discussions'
          className='border inline-flex flex-col items-center justify-center h-14 rounded-2xl hover:shadow-sm transition-shadow text-lg font-semibold px-10 text-lg md:text-xl lg:text-2xl sm:mr-4'
        >🧑‍💻 Office Hours</a>
        <a
          href='https://github.com/json-schema-org/community/discussions/35'
          className='border inline-flex flex-col items-center justify-center h-14 rounded-2xl hover:shadow-sm transition-shadow text-lg font-semibold px-10 text-lg md:text-xl lg:text-2xl mt-4 sm:mt-0'
        >👷 Open Community Working Meetings</a>
      </div>
      <p className='text-slate-600 block leading-7 pb-4'>
        Office Hours are every first Tuesday of the month at 15:00 UTC, and by appointment.
      </p>
      <p className='text-slate-600 block leading-7 pb-4'>
        Open Community Working Meetings are every First and Third Friday of the month at 12:00 PT.
      </p>

      <StyledMarkdown markdown={blocks[0]} />
    </Layout>
  )
}

export default Home
