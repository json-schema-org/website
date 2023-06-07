import React from 'react'
import Layout from '~/components/Layout'
import HeroSearch from '~/components/heroSearch'
import fs from 'fs'
import matter from 'gray-matter'
const PATH = 'pages/blog/posts'
import readingTime from 'reading-time'
import Link from 'next/link'
import TextTruncate from 'react-text-truncate'
import { Headline3 } from '~/components/Headlines'
import Calendar from '~/components/Calendar'



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
        <section className=' bg-gradient-to-r from-startBlue from-1.95% to-endBlue clip-bottom'>
          <div className='w-3/4 text-center mx-auto mt-24 lg:mt-40'>
            <h1 className='lg:leading-header text-3xl lg:text-5xl font-semibold text-white text-center'>
              JSON Schema is a declarative language that allows you to annotate and validate JSON documents.
            </h1>
            <h2 className='lg:leading-6 text-center text-xl text-white mt-4 '>
              JSON Schema enables the confident and reliable use of the JSON data format.
            </h2>
            <div className='w-3/5  mx-auto my-10 grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center'>
              <Link href='/learn/getting-started-step-by-step' ><a className='pt-1 rounded border-2 border-white text-white  w-[194px] h-[40px] text-white'>Get Started</a></Link>
              <Link href='/learn/getting-started-step-by-step' ><a className='pt-1 rounded border-2 border-white text-white  w-[194px] h-[40px] text-white'>Community</a></Link>
              <HeroSearch />

            </div>
        
            <div className='mb-16 md:mb-36 lg:mb-28 mx-auto'>
              <h3 className='text-white mb-4'>Trusted by</h3>
              <div className='flex gap-6 justify-center w-100 text-white text-center mx-auto'>

                <img src='/img/logos/openjs_foundation-logo-horizontal-white.svg' className='h-[73] w-24' />
                <img src='/img/logos/slack_technologies_logo-white.svg' className='h-[73] w-24' />
                <img src='/img/logos/toast_logo-white.svg' className='h-[73] w-24' />
                <img src='/img/logos/postman_logo-white.svg' className='h-[73] w-24' />
              </div>
            </div>
          </div>
        </section>
        {/* Feature */}
        <section className='mt-12 lg:mt-[80px]'>
          <div className='w-5/6 md:w-1/2 text-center  mb-6  mx-auto'>
            <h2 className='text-3xl font-bold mb-6'>Why JSON Schema?</h2>
            <p className='mb-6 leading-5 text-xl'>Nulla pulvinar sagittis eleifend. Maecenas convallis gravida convallis. Aliquam facilisis augue purus, id mattis lectus luctus non. </p>
          </div>
          {/* Feature 4 section*/}
          <div className='w-5/6 lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6   my-[85px] mx-auto '>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-xl font-semibold mb-6'>Simplify testing and validation</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-xl font-semibold mb-6'>Easy and reliable data exchange</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-xl font-semibold mb-6'>Simplify testing and validation</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
            </div>
            <div className='w-full  shadow-3xl  rounded-[10px] p-[20px]'>
              <h3 className='text-xl font-semibold'>Easy and reliable data exchange</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
            </div>
          </div>
        </section>

        <div className='w-full h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both'>
          <div className='lg:w-2/3 mx-auto text-center mt-20 md:mt-28'>
            <h2 className='text-3xl lg:text-4xl text-white mb-6 text-center'>Learn more about our documentation</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white '>Read the Docs</button>
          </div>
        </div>

        {/* SidebySide section*/}
        <section className='lg:flex gap-24 mt-12 md:my-24'>
          <img src='/img/home-page/community-illustration.svg' className='lg:w-[830px]' />
          <div className='w-5/6 mx-auto lg:w-full' >
            <h3 className='md:text-center text-3xl lg:text-4xl font-semibold md:w-2/3 my-4'>Learn more about the JSON Schema Ecosystem</h3>
            <p className='hidden lg:block lg:w-4/5 mb-4 text-left md:text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. Maecenas convallis gravida convallis. Aliquam facilisis augue purus, id mattis lectus luctus non. Nullam mollis tortor vestibulum est pharetra elementum. Integer lectus mauris, tempus eu odio non, tristique ullamcorper arcu.</p>
            <button className='hidden md:block rounded border-2 bg-primary text-white w-full h-[40px] lg:w-[170px]  mb-24 '>Contribute</button>
            <button className='md:hidden rounded border-2 bg-primary text-white w-full h-[40px] mb-24' >Read the docs</button>
          </div>
        </section>

        {/* Join community */}
        <h2 className='anchor'><span id='community'></span></h2>
        <section className='my-12'>
          <div className='mb-12 md:w-3/4  mx-auto text-center'>
            <h2 className='text-4xl font-semibold mb-2'>Join our great community</h2>
            <p className='mx-4 md:w-3/4 md:mx-auto text-xl'>We have an active and growing community. All are welcome to be part of our community, help shape it, or simply observe.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3  gap-6 mb-12 mx-auto w-5/6'>
            <div className='w-full  mb-6'>
              <h3 className='mb-4 font-semibold' >Join our Slack workspace</h3>
              <img src='/img/home-page/cover-1.jpeg' className='w-full mb-4' />
              <h3 className='mb-4 font-semibold' >Event</h3>
              <p className='mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.  Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. </p>
              <button className='w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] '>Join us</button>
            </div>
            {/* BlogPost Data */}
            <div className='w-full '>
              <h3 className='mb-4 font-semibold' >Latest news and blogs</h3>
              <img src={recentBlog[0].frontmatter.cover} className='w-full  mb-4' />
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
              <div className=' mb-6 mr-4'>
                <h3 className='mb-2 font-semibold' >Join our public meetings</h3>
                <p className='mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.  Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. </p>
                <div className='lg:flex'>
                  <button className='w-full  rounded border-2 bg-primary text-white lg:w-[211px] h-[40px] '>Community Discussions</button>
                  <button className='w-full  rounded border-2 bg-primary text-white lg:w-[190px] h-[40px] '>Office Hours</button>
                </div>
              </div>
              <div className=''>
                {/* <Calendar /> */}
                <div>
                  <Headline3 >
                Upcoming events
                  </Headline3>
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
        <section className='w-full h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both'>
          <div className='lg:w-full mx-auto text-center mt-28 '>
            <h2 className='text-3xl lg:text-4xl text-white mb-6'>Contribute to the JSON Schema ecosystem</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white '>Contribute</button>
          </div>
        </section>

        {/* Sponsors */}

        <section className='my-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-semibold mb-4'>Sponsors</h2>
            <p className='w-5/6 lg:w-3/5 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.</p>
          </div>
          <div className='grid grid-cols-2 lg:grid-cols-5 gap-8 mx-4 md:mx-0'>
            <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
            <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
            <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
            <img src='/img/logos/Postman_logo-orange.svg' className='mx-auto' />
            <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
          </div>
        </section>

        {/* Supported */}

        <section className='mb-12 md:my-28'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-semibold mb-4'>Supported by</h2>
            <p className='w-5/6 lg:w-3/5 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.</p>
          </div>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-12 mx-auto mx-4 md:mx-0'>
            <img src='/img/logos/slack_technologies_logo.svg' className='mx-auto' />
            <img src='/img/logos/openjs_foundation-logo-horizontal-color.svg' className='mx-auto w-[190px]' />
            <img src='/img/logos/toast_logo.svg' className='mx-auto w-[190px]' />
            <img src='/img/logos/Postman_logo-orange.svg' className='mx-auto' />
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Home
