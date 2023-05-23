import React from 'react'


export default function SideBySide () {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 my-12  ml-6 w-5/6'>

      <img src='/img/home-page/validation-illustration.svg' className='w-full ' />

      <div className='w-full  m-auto lg:ml-4'>
        <h3 className='text-3xl font-semibold w-1/2'>Learn more about the JSON Schema Ecosystem</h3>
        <p className='lg:w-3/4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis. Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. Maecenas convallis gravida convallis. Aliquam facilisis augue purus, id mattis lectus luctus non. Nullam mollis tortor vestibulum est pharetra elementum. Integer lectus mauris, tempus eu odio non, tristique ullamcorper arcu.</p></div>
    </div>
  )
}