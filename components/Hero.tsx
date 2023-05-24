import React from 'react'
// import { DocSearch } from '@docsearch/react'
import { Search } from './Layout'

export default function Hero () {
  return (
    <div
      className='h-[744px] lg:h-[658px] bg-gradient-to-r from-[#052FC7] from-1.95% to-[#5468FF] clip-bottom '
    >
      <div className='w-5/6 text-center mx-auto mt-4 lg:mt-[100px]'>
        <h1 className='lg:leading-header text-3xl lg:text-5xl font-semibold text-white text-center'>
              JSON Schema is a declarative language that allows you to annotate and validate JSON documents.
        </h1>
        <h2 className='lg:leading-6 text-center text-xl text-white mt-4 '>
              JSON Schema enables the confident and reliable use of the JSON data format.
        </h2>
        <div className='w-1/3 lg:w-1/2 mx-auto my-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center  '>
          <button className='rounded border-2 border-white text-white px-12 py-2 mr-10 w-[194px]'>Get Started</button>
          <button className='rounded border-2 border-white text-white px-12 py-2 mr-10 w-[194px]'>Community</button>
          {/* <button className="rounded border-2 border-white bg-white p-2">Quick Search</button> */}
          <Search />
      
        </div>
        <div className='mb-8 mx-auto'>
          <h3 className='text-white mb-4'>Trusted by</h3>
          <div className='flex gap-6 justify-center w-100 text-white text-center mx-auto'>

            <img src='/img/logos/openjs_foundation-logo-horizontal-white.svg' className='h-[73] w-24' />
            <img src='/img/logos/slack_technologies_logo-white.svg' className='h-[73] w-24' />
            <img src='/img/logos/toast_logo-white.svg' className='h-[73] w-24' />
            <img src='/img/logos/postman_logo-white.svg' className='h-[73] w-24' />
          </div>
        </div>
      </div>
    </div>
  )

}