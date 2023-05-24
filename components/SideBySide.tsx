import React from 'react'


export default function SideBySide () {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 my-12  ml-6 w-5/6'>

      <img src='/img/home-page/community.svg' className='w-full ' />

      <div className='w-full  m-auto lg:ml-4'>
        <h3 className='text-3xl lg:text-4xl font-semibold w-5/6 lg:w-1/2'>Learn more about the JSON Schema Ecosystem</h3>
        <p className='hidden lg:block lg:w-3/5 mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. Maecenas convallis gravida convallis. Aliquam facilisis augue purus, id mattis lectus luctus non. Nullam mollis tortor vestibulum est pharetra elementum. Integer lectus mauris, tempus eu odio non, tristique ullamcorper arcu.</p>
        <button className='hidden md:block rounded border-2 bg-[#002CC4] text-white w-full h-[40px] lg:w-[170px]  mb-24 '>Contribute</button>
        <button className='md:hidden rounded border-2 bg-[#002CC4] text-white w-full h-[40px] lg:w-[170px]  mb-24 '>Read the docs</button>
      </div>
    
    </div>
  )
}