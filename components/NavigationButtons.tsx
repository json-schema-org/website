import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

interface NavigationButtonsProps {
  prevLabel?: string;
  prevURL?: string;
  nextLabel?: string;
  nextURL?: string;
}

const NavButton = ({
  label,
  url,
  direction,
}: {
  label?: string;
  url?: string;
  direction: 'prev' | 'next';
}) => {
  if (!url || !label) return <div className='h-auto w-1/2' />;

  const isPrev = direction === 'prev';
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const buttonText = isPrev ? 'Go Back' : 'Up Next';

  return (
    <div className='h-auto w-1/2' data-test={`nav-button-${direction}`}>
      <Card className='h-full cursor-pointer border-gray-200 p-4 text-center shadow-md transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg dark:shadow-xl dark:hover:shadow-lg dark:drop-shadow-lg lg:text-left'>
        <Link href={url} className='block'>
          <Button
            variant='ghost'
            className={`group
              w-full gap-3 sm:gap-5
              p-0
              text-sm sm:text-[18px]
              hover:bg-transparent
              transition-all
              ${isPrev ? 'justify-start' : 'justify-end'}
            `}
          >
            {isPrev && (
              <Icon
                className='h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:-translate-x-1'
                data-test='nav-button-icon'
              />
            )}

            <div
              className='my-auto inline font-bold uppercase text-primary dark:text-slate-300
                         transition-transform duration-300 origin-center
                         group-hover:scale-110'
              data-test='nav-button-text'
            >
              {buttonText}
            </div>
            {!isPrev && (
              <Icon
                className='h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1'
                data-test='nav-button-icon'
              />
            )}
          </Button>
          <div
            className={`my-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 ${isPrev ? 'text-left' : 'text-right'}`}
            data-test='nav-button-label'
          >
            {label}
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default function NavigationButtons({
  prevLabel,
  prevURL,
  nextLabel,
  nextURL,
}: NavigationButtonsProps) {
  return (
    <div className='mb-4 flex flex-row gap-4'>
      <NavButton label={prevLabel} url={prevURL} direction='prev' />
      <NavButton label={nextLabel} url={nextURL} direction='next' />
    </div>
  );
}
