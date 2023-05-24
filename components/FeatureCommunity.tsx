import React from 'react'


export default function FeatureCommunity() {
  return (
    <div className='lg:w-5/6 mb-12'>
      <div className='mb-12 w-3/4 lg:w-1/2 mx-auto text-center'>
        <h2 className='text-3xl font-semibold mb-4'>Join our great community</h2>
        <p className='w-5/6w-2/5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3  gap-6 mb-12 mx-auto w-5/6'>

        <div className='w-full  mb-6'>
          <h3 className='mb-4 font-semibold' >Join our Slack workspace</h3>
          <img src='/img/home-page/cover-1.jpeg' className='w-full mb-4' />

          <h3 className='mb-4 font-semibold' >Event</h3>
          <p className='mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.  Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. </p>
          <button className='w-full lg:w-1/2 rounded border-2 bg-[#002CC4] text-white px-12 py-2  '>Read more</button>
        </div>
        <div className='w-full '>
          <h3 className='mb-4 font-semibold' >Latest news and blogs</h3>
          <img src='/img/home-page/cover-2.jpeg' className='w-full  mb-4' />
          <h3 className='mb-4 font-semibold' >Blog title</h3>
          <p className='mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.  Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. </p>
          <button className='w-full lg:w-1/2 rounded border-2 bg-[#002CC4] text-white px-12 py-2  '>Read more</button>
        </div>
        <div className=' '>
          <div className=' mb-6 mr-4'>
            <h3 className='mb-4 font-semibold' >Join our public meetings</h3>
            <p className='mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.  Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. </p>
            <div className='flex'>
              <button className='w-full  rounded border-2 bg-[#002CC4] text-white w-[211px] h-[40px] '>Community Dissucssions</button>
              <button className='w-full  rounded border-2 bg-[#002CC4] text-white w-[190px] h-[40px] '>Office Hours</button>
            </div>
          </div>

          <div className=''>
            <h3 className='mb-4 font-semibold'>Upcoming events</h3>
            <div className='flex mb-4'><p className='bg-[#002CC4] rounded-full w-7 h-7 px-2 text-center text-white mr-2'>26</p><p className=''>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
            <div className='flex mb-4'><p className='bg-[#002CC4] rounded-full w-7 h-7 px-2 text-center text-white mr-2'>26</p><p className=''>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
            <div className='flex mb-4'><p className='bg-[#002CC4] rounded-full w-7 h-7 px-2 text-center text-white mr-2'>26</p><p className=''>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
            <button className='w-[190px] h-[40px] rounded border-2 bg-[#002CC4] text-white  '>View Calendar</button>

          </div>

        </div>
         
      </div>

    </div>
  )
}