import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

type NextPrevButtonProps = {
  prevLabel: string;
  prevURL: string;
  nextLabel: string;
  nextURL: string;
};

export default function NextPrevButton({
  prevLabel,
  prevURL,
  nextLabel,
  nextURL,
}: NextPrevButtonProps) {
  return (
    <div className='mb-4 flex flex-row gap-4'>
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
              <div className='my-auto inline font-bold uppercase '>Go Back</div>
            </div>
            <div className='my-2 text-base font-medium text-slate-600 dark:text-slate-300'>
              {prevLabel}
            </div>
          </Link>
        </div>
      </div>

      <div className='h-auto w-1/2'>
        <div className='h-full cursor-pointer rounded border border-gray-200 p-4 text-center shadow-md transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg dark:shadow-xl dark:drop-shadow-lg dark:hover:shadow-2xl lg:text-right'>
          <Link href={nextURL}>
            <div className='text-primary dark:text-slate-300 flex flex-row-reverse gap-5 text-[18px]'>
              <Image
                src={'/icons/arrow.svg'}
                height={10}
                width={10}
                alt='next icon'
                className='w-5'
              />
              <div className='my-auto inline font-bold uppercase '>Up Next</div>
            </div>
            <div className='my-2 text-base font-medium text-slate-600 dark:text-slate-300'>
              {nextLabel}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
