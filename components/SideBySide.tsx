import React from 'react'


export default function SideBySide () {
  return (
    <div className='lg:flex gap-24 my-24'>

      <img src='/img/home-page/community-illustration.svg' className='lg:w-[830px]' />

      <div className='w-5/6 mx-auto lg:w-full'>
        <h3 className='text-3xl lg:text-4xl font-semibold w-2/3 my-4'>Learn more about the JSON Schema Ecosystem</h3>
        <p className='hidden lg:block lg:w-4/5 mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. Maecenas convallis gravida convallis. Aliquam facilisis augue purus, id mattis lectus luctus non. Nullam mollis tortor vestibulum est pharetra elementum. Integer lectus mauris, tempus eu odio non, tristique ullamcorper arcu.</p>
        <button className='hidden md:block rounded border-2 bg-primary text-white w-full h-[40px] lg:w-[170px]  mb-24 '>Contribute</button>
        <button className='md:hidden rounded border-2 bg-primary text-white w-full h-[40px]   mb-24 '>Read the docs</button>
      </div>
    
    </div>
  )
}