import React from 'react'


export default function FeatureSection() {
  return (
    <section className=' lg:mt-[80px]'>
      <div className='w-1/2 text-center  mb-6  mx-auto'>
        <h2 className='text-3xl font-bold mb-6'>Why JSON Schema?</h2>
        <p className='mb-6 leading-5 text-xl'>Nulla pulvinar sagittis eleifend. Maecenas convallis gravida convallis. Aliquam facilisis augue purus, id mattis lectus luctus non. </p>
      </div>
      {/* Feature 4 section*/}
      <div className='w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12  my-[85px] mx-auto'>
        <div className='w-full lg:w-4/5'>
          <h3 className='text-xl font-semibold mb-6'>Simplify testing and validation</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
        </div>
        <div className='w-full lg:w-4/5'>
          <h3 className='text-xl font-semibold mb-6'>Easy and reliable data exchange</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
        </div>
        <div className='w-full lg:w-4/5'>
          <h3 className='text-xl font-semibold mb-6'>Simplify testing and validation</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
        </div>
        <div className='w-full lg:w-4/5'>
          <h3 className='text-xl font-semibold'>Easy and reliable data exchange</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p>
        </div>
      </div>
    </section>
  )
}