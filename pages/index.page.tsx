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
        <button className='rounded border-2 bg-[#002CC4] text-white px-12 py-2'>Read the Docs</button>
        {/* SidebySide section*/}

        <SideBySide />
        <button className='rounded border-2 bg-[#002CC4] text-white px-12 py-2  mb-24 '>Read the Docs</button>

        {/* Join community */}
        <FeatureCommunity />
        {/* News & Blogs */}
        <FeatureNews />
        <button className='rounded border-2 bg-[#002CC4] text-white px-12 py-2  mb-24 '>Read the Docs</button>

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
