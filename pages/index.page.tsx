import React from 'react'
import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import Link from 'next/link'
import { Headline2 } from '~/components/Headlines'
import Code from '~/components/Code'

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
        <div className='grid grid-cols-1 sm:grid-cols-3 w-full gap-4 max-w-xl'>
          <Link href='/learn/getting-started-step-by-step'>
            <a className='p-4 text-center block border flex flex-col items-center justify-center h-40 rounded-2xl hover:shadow-md transition-shadow text-lg font-semibold'>
              <div className='text-6xl mb-2'>
                👋
              </div>
              Getting started
            </a>
          </Link>
          <Link href='/understanding-json-schema/reference/type'>
            <a className='p-4 text-center block border flex flex-col items-center justify-center h-40 rounded-2xl hover:shadow-md transition-shadow text-lg font-semibold'>
              <div className='text-6xl mb-2'>
                📖
              </div>
              Docs
            </a>
          </Link>
          <Link href='/implementations'>
            <a className='p-4 text-center block border flex flex-col items-center justify-center h-40 rounded-2xl hover:shadow-md transition-shadow text-lg font-semibold'>
              <div className='text-6xl mb-2'>
                🔌
              </div>
              Implementations
            </a>
          </Link>
        </div>
      </div>


      <Headline2>
        Community
      </Headline2>
      <p className='text-slate-600 block leading-7 pb-4'>
        We have an active and growing community. All are welcome to be part of our community, help shape it, or simply observe.
        We want to keep our community welcoming and inclusive, so please read our <a className='text-blue-500' href='https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md'>JSON Schema Organizational Code of Conduct</a>. (This is a combination of the Contributor Covenant and IETF BCP 54.)
        The JSON Schema team and community are here to help!
        At any point, feel free to join our <a className='text-blue-500' href='/slack'>Slack server</a>.
        Our Slack server has limited history, so we also use <a className='text-blue-500' href='https://github.com/json-schema-org/community/discussions'>GitHub Discussions</a>.
        We monitor the <Code>jsonschema</Code> tag on StackOverflow.
      </p>
      <div className='flex flex-col sm:flex-row py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'>
        <a
          href='https://github.com/json-schema-org/community/discussions'
          className='border inline-flex flex-col items-center justify-start rounded-2xl hover:shadow-sm transition-shadow px-10 py-6 hover:shadow transition-shadow'
        >
          <div className='text-4xl mb-2'>👩‍💻</div>
          <span className='text-md md:text-lg font-semibold text-center'>Office Hours</span>
          <span className='text-center text-slate-500 text-sm mt-6'>Open zoom meeting<br />every first Tuesday of the month at 15:00 UTC<br />and by appointment.</span>
        </a>
        <a
          href='https://github.com/json-schema-org/community/discussions/35'
          className='self-stretch border inline-flex flex-col items-center justify-start rounded-2xl hover:shadow-sm transition-shadow px-10 py-6 hover:shadow transition-shadow'
        >
          <div className='text-4xl mb-2'>👷</div>
          <span className='text-md md:text-lg font-semibold text-center'>Open Community Working Meetings</span>
          <span className='text-center text-slate-500 text-sm mt-6'>Open zoom meeting<br />every First and Third Friday of the month at 12:00 PT.</span>
        </a>
        <a
          href='https://github.com/json-schema-org/community/discussions/35'
          className='self-stretch border inline-flex flex-col items-center justify-start rounded-2xl hover:shadow-sm transition-shadow px-10 py-6 hover:shadow transition-shadow'
        >
          <div className='text-4xl mb-4'><img src='/img/logos/slack.svg' className='h-8 w-8' /></div>
          <span className='text-md md:text-lg font-semibold text-center'>Open Slack Workspace</span>
          <span className='text-center text-slate-500 text-sm mt-6'>Discuss and ask questions about all JSON Schema related things.</span>
        </a>
        <a
          href='https://github.com/json-schema-org/community/discussions'
          className='self-stretch border inline-flex flex-col items-center justify-start rounded-2xl hover:shadow-sm transition-shadow px-10 py-6 hover:shadow transition-shadow'
        >
          <div className='text-4xl mb-2'>💬</div>
          <span className='text-md md:text-lg font-semibold text-center'>GitHub Community Discussions</span>
          <span className='text-center text-slate-500 text-sm mt-6'>Persistent organization level JSON Schema related discussions.</span>
        </a>
      </div>

      <StyledMarkdown markdown={blocks[0]} />
    </Layout>
  )
}

export default Home
