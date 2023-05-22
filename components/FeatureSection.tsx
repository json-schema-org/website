import React from 'react'


export default function FeatureSection () {
    return (
        <section className='w-1/2 mt-[100px]'>
        <div className='text-center '>
        <h2 className='text-3xl font-bold mb-6'>Why JSON Schema?</h2>
        <p className='mb-6 leading-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. Maecenas convallis gravida convallis. Aliquam facilisis augue purus, id mattis lectus luctus non. Nullam mollis tortor vestibulum est pharetra elementum. Integer lectus mauris, tempus eu odio non, tristique ullamcorper arcu.</p>
        <button className="rounded border-2 bg-[#002CC4] text-white px-12 py-2">Read the Docs</button>
      </div>
      {/* Feature 4 section*/}
      <div className='grid grid-cols-2 gap-12 content-center  my-[85px]'>
      <div className=' flex mb-4'>
        <div className='bg-blue'>
          <img src='/img/home-page/easy-and-reliable-data-exchange-icon.svg' className=' h-[124px] w-[124px] mr-8' />
        </div>
        <div className='w-[334px]'>
          <h3 className='text-xl font-semibold'>Simplify testing and validation</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p></div>
      </div>
      <div className=' flex mb-4'>
        <div className=''>
          <img src='/img/home-page/testing-validation-icon.svg' className=' h-[144px] w-[144px] mr-8' />
        </div>
        <div className='w-[334px]'>
          <h3 className='text-xl font-semibold'>Easy and reliable data exchange</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p></div>
      </div>
      <div className='flex mb-4'>
        <div className='bg-blue'>
          <img src='/img/home-page/easy-and-reliable-data-exchange-icon.svg' className=' h-[124px] w-[124px] mr-8' />
        </div>
        <div className='w-[334px]'>
          <h3 className='text-xl font-semibold'>Simplify testing and validation</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p></div>
      </div>
      <div className='flex mb-4'>
        <div className=''>
          <img src='/img/home-page/testing-validation-icon.svg' className=' h-[144px] w-[144px] mr-8' />
        </div>
        <div className='w-[334px]'>
          <h3 className='text-xl font-semibold'>Easy and reliable data exchange</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend.</p></div>
      </div>

    </div>
    </section>
    )
}