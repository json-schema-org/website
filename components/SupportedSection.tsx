import React from 'react'


export default function SupportedSection () {
    return (
        <div className='mb-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-semibold mb-4'>Supported by</h2>
          <p className='w-3/5 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.</p>
        </div>
        <div className='flex gap-6'>
          <img src='/img/logos/slack_technologies_logo.svg' className='mx-auto' />
          <img src='/img/logos/openjs_foundation-logo-horizontal-color.svg' className='mx-auto w-[190px]' />
          <img src='/img/logos/toast_logo.svg' className='mx-auto w-[190px]' />
          <img src='/img/logos/postman_logo-orange.svg' className='mx-auto' />

        </div>
      </div>
    )
}