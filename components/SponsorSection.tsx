import React from 'react'


export default function SponsorSection () {
  return (
    <div className='my-20'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-semibold mb-4'>Sponsors</h2>
        <p className='w-5/6 lg:w-3/5 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.</p>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-5 gap-8'>
        <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
        <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
        <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
        <img src='/img/logos/Postman_logo-orange.svg' className='mx-auto' />
        <img src='/img/logos/Postman_logo-grey.svg' className='mx-auto' />
      </div>
    </div>
  )
}