import React from 'react';
import data from 'data/casestudies.json';
import Link from 'next/link';
export default function CaseStudies() {
  return (
    <div className='w-full lg:w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-[10px] mx-auto '>
      {data.map((element, index) => (
        <div key={index} className='w-full shadow-3xl rounded-[10px] p-[20px]'>
          <img src={element.logo} className='h-5' />
          <div className='mt-4 mb-4'>{element.summary}</div>
          <ul>
            {element.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <Link href={link.url} className='text-blue-500'>
                  {link.lang}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
