import React from 'react'
import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'

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
      mainClassName='flex flex-col items-center'
    >
      <h1 className='text-5xl mt-[100px] font-black text-center'>
        Describe and validate JSON documents
      </h1>
      <h2 className='text-center text-lg text-slate-600 mt-6 max-w-4xl'>
        JSON schema is the standard vocabulary for describing JSON data.<br />It validates documents and provides a clear human- and machine- readable documentation.
      </h2>

      <br /><br />
      <h2 className='mt-10 text-2xl font-bold'>
        Application areas
      </h2>
      automated testing
      quality assurance of client submitted data

      <h2 className='mt-10 text-2xl font-bold'>
        getting started
      </h2>
      We have our other [learning resources](/learn), including the [Understanding JSON Schema documentation](/understanding-json-schema).


      <h2 className='mt-10 text-2xl font-bold'>
        community
      </h2>
      We have an active and growing community. All are welcome to be part of our community, help shape it, or simply observe.

      We want to keep our community welcoming and inclusive, so please read our [JSON Schema Organizational Code of Conduct](https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md). (This is a combination of the Contributor Covenant and IETF BCP 54.)

      The JSON Schema team and community are here to help!

      At any point, feel free to join our [Slack server](/slack).

      Our Slack server has limited history, so we also use [GitHub Discussions](https://github.com/json-schema-org/community/discussions).

      We monitor the `jsonschema` tag on StackOverflow.

      Learn, Get help, Shape the Community, Chat, with the JSON Schema team and Community!
      <div className='wrapper text-center buttons'>
        <a className='button border button-center' href='/learn/getting-started-step-by-step'>👋 Getting Started</a>
        <a className='button border button-center' href='/slack' target='_blank'>
          <img className='small-svg-logo'
            src='/assets/logo-slack.svg'
            height='1.3em' width='1.3em' /> Open
          JSON Schema Slack</a>
        <a
          className='button border button-center'
          href='https://github.com/json-schema-org/community/discussions'
          target='_blank' rel='noreferrer'>💬 Community Discussions</a>
      </div>

      Office Hours are every first Tuesday of the month at 15:00 UTC, and by appointment.

      <div className='wrapper text-center buttons'>
        <a className='button border button-center' href='https://github.com/json-schema-org/community/discussions/34' target='_blank' rel='noreferrer'>🧑‍💻 Office Hours</a>
        <a className='button border button-center' href='https://github.com/json-schema-org/community/discussions/35' target='_blank' rel='noreferrer'>👷 Open Community Working Meetings</a>
      </div>
      Office Hours are every Tuesday at 15:00 UTC.

      Open Community Working Meetings are every First and Third Friday of the month at 12:00 PT.


      <StyledMarkdown markdown={blocks[0]} />




    </Layout>
  )
}

export default Home
