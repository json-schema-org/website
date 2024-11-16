import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

/*
To use this component:
1) Add prev and next metadata to the markdown page following this format:

---
title: Creating your first schema
section: docs
prev: 
  label: prev
  url: '#1'
next: 
  label: Miscellaneous examples
  url: '#2'
---

2) Add the component to the typescript page:

import NextPrevButton from '~/components/NextPrevButton';

3) Add the component to the body of the page:

<NextPrevButton prevLabel={frontmatter.prev.label} prevURL={frontmatter.prev.url} nextLabel={frontmatter.next.label} nextURL={frontmatter.next.url} />
*/

export default function NextPrevButton({
  prevLabel,
  prevURL,
  nextLabel,
  nextURL,
}: any) {
  return (
    <div className='mb-4 flex flex-row gap-4'>
      {prevURL && prevLabel ? (
        <div className='h-auto w-1/2'>
          <div
            className='cursor-pointer rounded border border-gray-200 p-4 text-center shadow-md transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg dark:shadow-xl dark:hover:shadow-2xl dark:drop-shadow-lg 
          lg:text-left'
          >
            <Link href={prevURL}>
              <div className='text-primary dark:text-slate-300 flex flex-row gap-5 text-[18px]'>
                <Image
                  src={'/icons/arrow.svg'}
                  height={10}
                  width={10}
                  alt='prev icon'
                  className='rotate-180 w-5 '
                />
                <div className='my-auto inline font-bold uppercase'>
                  Go Back
                </div>
              </div>
              <div className='my-2 text-base font-medium text-slate-600 dark:text-slate-300'>
                {prevLabel}
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className='h-auto w-1/2'></div>
      )}

      {nextURL && nextLabel ? (
        <div className='h-auto w-1/2'>
          <div className='h-full cursor-pointer rounded border border-gray-200 p-4 text-center shadow-md transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg dark:shadow-xl dark:drop-shadow-lg dark:hover:shadow-2xl lg:text-right'>
            <Link href={nextURL}>
              <div className='text-primary  dark:text-slate-300 flex flex-row-reverse gap-5 text-[18px]'>
                <Image
                  src={'/icons/arrow.svg'}
                  height={10}
                  width={10}
                  alt='next icon '
                  className='w-5'
                />
                <div className='my-auto inline font-bold uppercase '>
                  Up Next
                </div>
              </div>
              <div className='my-2 text-base font-medium text-slate-600 dark:text-slate-300'>
                {nextLabel}
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className='h-auto w-1/2'></div>
      )}
    </div>
  );
}
