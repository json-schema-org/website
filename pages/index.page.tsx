import React from 'react'
import Layout from '~/components/Layout'
// import fs from 'fs'
// import matter from 'gray-matter'
// import StyledMarkdown from '~/components/StyledMarkdown'
// import Link from 'next/link'
// import { Headline2 } from '~/components/Headlines'
// import Code from '~/components/Code'

import Hero from '~/components/Hero'
import FeatureSection from '~/components/FeatureSection'
import SideBySide from '~/components/SideBySide'
import FeatureCommunity from '~/components/FeatureCommunity'
import FeatureNews from '~/components/FeatureNews'
import SponsorSection from '~/components/SponsorSection'
import SupportedSection from '~/components/SupportedSection'

// export async function getStaticProps() {
//   const block1 = fs.readFileSync('pages/_index.md', 'utf-8')
//   const { content: block1Content } = matter(block1)
//   return {
//     props: {
//       blocks: [block1Content]
//     }
//   }
// }

const Home = () => {
  return (
    <Layout
      mainClassName='flex flex-col'
      hideAds
    >
      <div className='flex flex-col items-center'>
        <Hero />
        {/* Feature */}
        <FeatureSection />
        <div className='w-full h-[367px] bg-gradient-to-r from-[#052FC7] from-1.95% to-[#5468FF] clip-both'>
          <div className='w-2/3 mx-auto text-center mt-28'>
            <h2 className='text-3xl lg:text-4xl text-white mb-6'>Learn more about our documentation</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-[#002CC4] text-white '>Read the Docs</button>
          </div>
        </div>
        {/* SidebySide section*/}

        <SideBySide />
        

        {/* Join community */}
        <FeatureCommunity />
        {/* News & Blogs */}
        {/* <FeatureNews /> */}
        <div className='w-full h-[447px] lg:h-[367px] bg-gradient-to-r from-[#052FC7] from-1.95% to-[#5468FF] clip-both'>
          <div className='w-2/3 mx-auto text-center mt-28'>
            <h2 className='text-3xl lg:text-4xl text-white mb-6'>Contribute to the JSON Schema ecosystem</h2>
            <button className='w-[170px] h-[45px] mx-auto rounded border-2 bg-[#002CC4] text-white '>Contribute</button>
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
