import React from 'react'
import { DocSearch } from '@docsearch/react'
import { Search } from './Layout'

export default function Hero () {
    return (
        <div
          className='h-[658px] bg-gradient-to-r from-[#052FC7] from-1.95% to-[#5468FF] clip-your-needful-style '
        >
          <div className='w-2/3 text-center mx-auto mt-[100px]'>
            <h1 className='leading-header text-5xl font-semibold text-white text-center'>
              JSON Schema is a declarative language that allows you to annotate and validate JSON documents.
            </h1>
            <h2 className='leading-6 text-center text-xl text-white mt-4 '>
              JSON Schema enables the confident and reliable use of the JSON data format.
            </h2>
            <div className='my-10 flex items-center'>
              <button className="rounded border-2 border-white text-white px-12 py-2 mr-10">Get Started</button>
              {/*       <button className="rounded border-2 border-white text-white px-12 py-2 mr-12">Office Hours</button> */}
              {/* <button className="rounded border-2 border-white bg-white p-2">Quick Search</button> */}
              <Search />
              {/* <DocSearch 
      appId='6ZT4KX2OUI'
      apiKey='69f76fba13585144f6686622e9c8f2a8'
      indexName='json-schema'
    /> */}
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