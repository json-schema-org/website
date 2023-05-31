import React from 'react'
import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
const PATH = 'pages/blog/posts'
import readingTime from 'reading-time'
import Link from 'next/link'
import TextTruncate from 'react-text-truncate'
import Hero from '~/components/Hero'
import FeatureSection from '~/components/FeatureSection'
import SideBySide from '~/components/SideBySide'
// import FeatureCommunity from '~/components/FeatureCommunity'
import SponsorSection from '~/components/SponsorSection'
import SupportedSection from '~/components/SupportedSection'

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
        <Hero />
        {/* Feature */}
        <FeatureSection />
        <div className='w-full h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both'>
          <div className='lg:w-2/3 mx-auto text-center mt-20 md:mt-28'>
            <h2 className='text-3xl lg:text-4xl text-white mb-6'>Learn more about our documentation</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white '>Read the Docs</button>
          </div>
        </div>
        {/* SidebySide section*/}

        <SideBySide />


        {/* Join community */}
        {/* <FeatureCommunity /> */}

        <div className=' mb-12'>
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
                <h3 className='mb-4 font-semibold'>Upcoming events</h3>
                <div className='flex mb-4'><p className='bg-btnOrange rounded-full w-10 h-10 p-2 text-center text-white mr-2'>26</p><p className=''>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
                <div className='flex mb-4'><p className='bg-btnOrange rounded-full w-10 h-10 p-2 text-center text-white mr-2'>26</p><p className=''>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
                <div className='flex mb-4'><p className='bg-btnGold rounded-full w-10 h-10 p-2 text-center text-white mr-2'>26</p><p className=''>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
                <button className='w-[190px] h-[40px] rounded border-2 bg-primary text-white  '>View Calendar</button>

              </div>

            </div>

          </div>

        </div>

        {/* News & Blogs */}
        {/* <FeatureNews /> */}
        <div className='w-full h-[367px] bg-gradient-to-r from-primary from-1.95% to-endBlue clip-both'>
          <div className='lg:w-full mx-auto text-center mt-28 '>
            <h2 className='text-3xl lg:text-4xl text-white mb-6'>Contribute to the JSON Schema ecosystem</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-primary text-white '>Contribute</button>
          </div>
        </div>

        {/* Sponsors */}
        <SponsorSection />

        {/* Supported */}
        <SupportedSection />

        {/* OLD CONTENT */}



      </div>


    </Layout>
  )
}

export default Home
