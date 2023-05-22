import React from 'react'


export default function FeatureCommunity () {
    return (
        <div className='w-5/6 mb-12'>
        <div className='mb-12'>
          <h2 className='text-xl font-semibold mb-4'>Join our great community</h2>
          <p className='w-2/5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.</p>
        </div>

        <div className='flex'>

          <img src='/img/logos/slack.svg' className='w-[140px] h-[140px] mr-4' />
          <div className='w-1/4 mb-12'>
            <h3 className='mb-4 font-semibold'>Join our Slack workspace</h3>
            <p className='mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.  Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. </p>
            <button className="rounded border-2 bg-[#002CC4] text-white px-12 py-2  ">Join us</button>
          </div>
        </div>
        <div className='flex'>
          <div className='w-1/4 '>
            <h3 className='mb-4 font-semibold' >Join our public meetings</h3>
            <p className='mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel tempus eros, vitae molestie quam. Integer id tincidunt felis.  Aliquam efficitur euismod ultricies. Nulla pulvinar sagittis eleifend. </p>
            <button className="rounded border-2 bg-[#002CC4] text-white px-12 py-2  ">Join us</button>
          </div>

          <div className='w-1/4'>
            <h3 className='mb-4 font-semibold'>Upcoming events</h3>
            <div className='flex mb-4'><p className='bg-[#002CC4] rounded-full w-7 h-7 text-center text-white mr-2'>26</p><p className='w-2/3'>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
            <div className='flex mb-4'><p className='bg-[#002CC4] rounded-full w-7 h-7 text-center text-white mr-2'>26</p><p className='w-2/3'>Event / Meeting / Conference Title Day, Date, Location, time</p></div>
            <button className="rounded border-2 bg-[#002CC4] text-white px-12 py-2  ">View Calendar</button>

          </div>


          <img src='/img/home-page/community.svg' className='-mt-72 mx-auto' />
        </div>

      </div>
    )
}