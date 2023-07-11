import React from 'react'
import Layout from '~/components/Layout'
import HeroSearch from '~/components/heroSearch'
import fs from 'fs'
import matter from 'gray-matter'
const PATH = 'pages/blog/posts'
import readingTime from 'reading-time'
import Link from 'next/link'
import TextTruncate from 'react-text-truncate'

import Calendar from '~/components/Calendar'
import { Headline4 } from '~/components/Headlines'



export async function getStaticProps() {
  const files = fs.readdirSync(PATH)
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

const Home = ({ blogPosts }: { blogPosts: any[] }) => {

  const recentBlog = blogPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime()
    const dateB = new Date(b.frontmatter.date).getTime()
    return dateA < dateB ? 1 : -1
  })
  const timeToRead = Math.ceil(readingTime(recentBlog[0].content).minutes)

  return (
    <Layout
      mainClassName='flex flex-col'
      hideAds
    >
      <div className='flex flex-col items-center'>
        {/* Hero  */}
        <section className='bg-[linear-gradient(72.68deg,_#002CC4_28.97%,_#5468FF_145.47%)] clip-bottom w-full'>
          <div className='max-w-[1400px] text-center mx-auto mt-24 lg:mt-40'>
            <h1 className='lg:leading-header text-h1mobile lg:text-h1 font-semibold text-white text-center px-1 md:px-0'>
              Build more. Break less. Empower others.
            </h1>
            <h2 className='lg:leading-6 text-center text-h5mobile md:text-h5  text-white mt-4 '>
              JSON Schema enables the confident and reliable use of the JSON data format.
            </h2>
            <div className='lg:w-[650px]  mx-auto my-10 grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center'>
              <Link href='/learn/getting-started-step-by-step' ><a className='pt-1 rounded border-2 border-white text-white  w-[194px] h-[40px]'>Getting started</a></Link>
              <Link href='#community' ><a className='pt-1 rounded border-2 border-white text-white  w-[194px] h-[40px]'>Community</a></Link>
              <HeroSearch />

            </div>

            <div className='mb-16 md:mb-36 lg:mb-28 mx-auto w-1/2 md:w-5/6 lg:w-full'>
              <h3 className='text-white mb-4'>Used by</h3>
              <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto items-center  w-1/2 md:w-100'>
                <img src='/img/logos/usedby/zapier-logo_white.png' className='w-40 mr-4' />
                <img src='/img/logos/usedby/microsoft-white.png' className='w-40 mr-4' />
                <img src='/img/logos/usedby/postman-white.png' className='w-40 mr-4' />
                <img src='/img/logos/usedby/github-white.png' className='w-40' />
              </div>
            </div>
          </div>
        </section>
        {/* Feature */}
        <section className='max-w-[1400px] mt-12 lg:mt-[80px]'>
          <div className='w-5/6 md:w-1/2 text-center  mb-6  mx-auto'>
            <h2 className='text-h3mobile md:text-h3 font-bold mb-6'>Why JSON Schema?</h2>
            <p className='mb-6 leading-5 text-h5mobile md:text-h5'>While JSON is probably the most popular format for exchanging data, JSON Schema is the vocabulary that allows JSON data consistency, validity, and interoperability at scale.</p>
          </div>
          {/* Feature 4 section*/}
          <div className='w-5/6 lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6   my-[85px] mx-auto '>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>Streamline testing and validation</h3>
              <p>Simplify your validation logic to reduce your code’s complexity and save time on development. Define constraints for your data structures to catch and prevent errors, inconsistencies, and invalid data.</p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>Exchange data seamlessly</h3>
              <p>Establish a common language for data exchange, no matter the scale or complexity of your project. Define precise validation rules for your data structures to create shared understanding and increase interoperability across different systems and platforms.</p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>Document your data</h3>
              <p>Create a clear, standardized representation of your data to improve understanding and collaboration among developers, stakeholders, and collaborators.</p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-h5mobile md:text-h5 font-semibold mb-6'>Vibrant tooling ecosystem</h3>
              <p>Adopt JSON Schema with an expansive range of community-driven tools, libraries, and frameworks across many programming languages.</p>
            </div>
          </div>
        </section>

        <section className='w-full h-[300px] lg:h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both'>
          <div className='lg:w-full mx-auto text-center mt-28 '>
            <h2 className='text-h3mobile lg:text-h3 text-white mb-6'>Start learning JSON Schema</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white '><a href='/overview/what-is-jsonschema'>Read the docs</a></button>
          </div>
        </section>

        {/* SidebySide section*/}
        <section className='max-w-[1400px] w-full lg:flex lg:gap-20 my-16 '>
          <img src='/img/home-page/community-illustration.svg' className='w-5/6 mx-auto lg:w-[600px] xl:w-[800px]' />
          <div className='w-5/6 md:w-3/5 mx-auto mt-12' >
            <h3 className=' text-center lg:text-left text-h3mobile md:text-h3 font-semibold mb-4'>Explore the JSON Schema Ecosystem</h3>
            <p className='pr-8 mb-4 text-center lg:text-left '>Discover trusted JSON Schema tooling to help your organization leverage the benefits of JSON Schema. Because JSON Schema is much more than a Specification, it is a vibrant ecosystem of Validators, Generators, Linters, and other JSON Schema Utilities made by this amazing Community.</p>
            <button className='w-full md:w-1/2 md:ml-28 lg:ml-0 mx-auto  h-[45px] rounded border-2 bg-primary text-white'><a href='/implementations/'>Explore</a></button>
 
          </div>
        </section>

        {/* Join community */}
        <h2 className='anchor'><span id='community'></span></h2>
        <section className='lg:my-12 max-w-[1400px]'>
          <div className='mb-12 md:w-3/4  mx-auto text-center'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-2'>Welcome to the JSON Schema Community</h2>
            <p className='mx-4 md:w-3/4 md:mx-auto  lg:text-h5'>With over 60 million weekly installs, JSON Schema has a large and active developer community across the world. Join the Community to learn, share ideas, ask questions, develop JSON Schema tooling and build new connections.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 mx-auto w-5/6'>
            <div className='w-full  mb-6'>
              <h3 className='mb-4 font-semibold' >Join the JSON Schema Community Slack!</h3>
              <img src='/img/home-page/slack-json-schema.png' className='w-full mb-4' />
              {/* <h3 className='mb-4 font-semibold' >Event</h3> */}
              <p className='mb-4'>Join our Slack to ask questions, get feedback on your projects, and connect with +5000 practitioners and experts.</p>
              <button className='w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] '><a href='https://json-schema.slack.com/join/shared_invite/zt-1tc77c02b-z~UiKXqpM2gHchClKbUoXw#/shared-invite/email'>Join us</a></button>
            </div>
            {/* BlogPost Data */}
            <div className='w-full '>
              <h3 className='mb-4 font-semibold' >Welcome to our blog!</h3>
              <img src={recentBlog[0].frontmatter.cover} className='w-full h-[232px]  mb-4' />
              <h3 className='mb-4 font-semibold' > {recentBlog[0].frontmatter.title}</h3>
              <div className='mb-4'><TextTruncate element='span' line={4} text={recentBlog[0].frontmatter.excerpt} /></div>
              <div className='flex ml-2 mb-2 '>
                <div className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                  style={{ backgroundImage: `url(${recentBlog[0].frontmatter.authors[0].photo})` }}
                />
                <div className='flex flex-col ml-2'>
                  <p className='text-sm font-semibold'>{recentBlog[0].frontmatter.authors[0].name}</p>
                  <div className='text-slate-500 text-sm'>
                    <span>
                      {recentBlog[0].frontmatter.date} &middot; {timeToRead} min read
                    </span>
                  </div>
                </div>
              </div>
              <div >
                <Link href={`/blog/posts/${recentBlog[0].slug}`}>
                  <a className='block w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] text-center pt-1 '>Read more </a>
                </Link>
              </div>
            </div>
            <div className=' '>
              <div className='md:w-full mb-6 mr-4'>
                <h3 className='mb-2 font-semibold' >JSON Schema Community Meetings & Events</h3>
                <p className='mb-4'>We hold monthly Office Hours and weekly Open Community Working Meetings. Office Hours are every first Tuesday of the month at 15:00 BST, and by appointment. Open Community Working Meetings are every Monday at 14:00 PT.
                </p>
                <div className=''>
                  <button className='max-w-[300px] w-full text-center rounded border-2 bg-primary text-white  h-[40px] mb-4'><a href='https://github.com/orgs/json-schema-org/discussions/35' >Open Community Working Meetings</a></button>
                  <button className='max-w-[200px] w-full text-center rounded border-2 bg-primary text-white  h-[40px] '><a href='https://github.com/orgs/json-schema-org/discussions/34/'
                  >Office Hours</a></button>
                </div>
              </div>
              <div className=''>
                {/* <Calendar /> */}
                <div>
                  <Headline4 >
                    Upcoming events
                  </Headline4>
                  <ul>
                    <Calendar />

                  </ul>
                </div>
                <a href='https://calendar.google.com/calendar/u/0/embed?src=c_8r4g9r3etmrmt83fm2gljbatos@group.calendar.google.com' className='block w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] text-center pt-1' target='_blank' rel='noopener noreferrer'>View Calendar</a>
              </div>
            </div>
          </div>
        </section>

        {/* News & Blogs */}
        <section className='w-full h-[300px] lg:h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both'>
          <div className='lg:w-full mx-auto text-center mt-28 '>
            <h2 className='text-h3mobile lg:text-h3 text-white mb-6'>Contribute to the JSON Schema</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white '><a href='https://github.com/json-schema-org#-contributing-to-json-schema
'>Contribute</a></button>
          </div>
        </section>

        {/* Sponsors */}

        <section className='my-20'>
          <div className='text-center mb-12'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-4'>Sponsors</h2>
            <p className='w-5/6 lg:w-3/5 mx-auto'>Want to become a sponsor? <a href='https://opencollective.com/json-schema' className='border-b border-black'>Support us!</a></p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center mx-auto mx-4 md:mx-0'>
            <a href=' https://www.asyncapi.com/'><img src='/img/logos/sponsors/asyncapi-logo-dark.svg' className=' w-44' /></a>
            <a href='https://www.airbnb.com/'><img src='/img/logos/sponsors/airbnb-logo.svg' className=' w-44' /></a>
            <a href='https://stoplight.io/'><img src='/img/logos/sponsors/stoplight-logo.svg' className=' w-44' /></a>
            <a href='https://www.postman.com/'><img src='/img/logos/sponsors/Postman_logo-orange.svg' className='w-44' /></a>
            <a href='https://retool.com/'><img src='/img/logos/sponsors/retool-logo.svg' className=' w-44' /></a>
            <a href='https://www.apideck.com/'><img src='/img/logos/sponsors/apideck-logo.png' className=' w-44' /></a>
          </div>
        
        </section>

        {/* Supported */}

        <section className='mb-12 md:my-28'>
          <div className='text-center mb-12'>
            <h2 className='text-h3mobile md:text-h3 font-semibold mb-4'>Supported by</h2>
            <p className='w-5/6 lg:w-3/5 mx-auto'>The following companies support us by letting us use their products." Instead of "Want to become a sponsor?<a href='https://opencollective.com/json-schema'>Support us</a>!</p>
          </div>
          <div className='w-1/2 grid grid-cols-2 items-center gap-12 mx-auto'>
            <a href='https://orbit.love/'><img src='/img/logos/supported/orbit-logo-color.png' className='w-36' /></a>
            <a href='https://slack.com/' ><img src='/img/logos/supported/slack-logo.svg' className='w-36' /></a>
            
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Home
