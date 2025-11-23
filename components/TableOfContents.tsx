'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { cn } from '~/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  className,
}) => {
  const router = useRouter();
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from the page
  useEffect(() => {
    const headings = document.querySelectorAll('h2, h3');
    const items: TocItem[] = [];

    // Skip the first heading and add "Introduction" as the first item
    if (headings.length > 0) {
      items.push({
        id: 'introduction',
        text: 'Introduction',
        level: 2, // Same level as h2
      });
    }

    // Start from index 1 to skip the first heading
    for (let i = 1; i < headings.length; i++) {
      // Get the heading element and its text content
      const heading = headings[i];
      // Get the text content of the heading
      const text = heading.textContent || '';
      // Get the ID of the heading, or generate one from the text content
      const id = heading.id || text.toLowerCase().replace(/\s+/g, '-');

      // If the heading doesn't have an ID, set one
      if (!heading.id && id) {
        heading.id = id;
      }
      // Add the heading to the table of contents
      items.push({
        id,
        text,
        level: parseInt(heading.tagName.substring(1), 10), // Get heading level (2 for h2, 3 for h3, etc.)
      });
    }

    setTocItems(items);
  }, [router.asPath]);

  // Intersection Observer to track which section is visible
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      // Callback function to handle intersection events
      (entries) => {
        // Track the currently active section
        let newActiveId = '';

        // Check if we are at the top of the page
        const isAtTop = window.scrollY < 100; // 100px from top

        // If at the top, highlight Introduction
        if (isAtTop) {
          newActiveId = 'introduction';
        } else {
          // Otherwise, find the first visible heading
          entries.forEach((entry) => {
            if (entry.isIntersecting && !newActiveId) {
              newActiveId = entry.target.id;
            }
          });
        }

        // Update the active ID
        if (newActiveId) {
          setActiveId(newActiveId);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1,
      },
    );

    // Observe all headings
    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        // Observe the element
        observer.observe(element);
      }
    });

    return () => {
      tocItems.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          // Unobserve the element
          observer.unobserve(element);
        }
      });
    };
  }, [tocItems]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        // If at the top, highlight Introduction
        setActiveId('introduction');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = useCallback(
    // Callback function to handle click events
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      // Get the element to scroll to
      const element =
        id === 'introduction'
          ? document.documentElement // Scroll to top for introduction
          : document.getElementById(id);

      if (element) {
        // Calculate the scroll position
        const yOffset = -80; // Adjust this value to match your header height
        const y =
          id === 'introduction'
            ? 0
            : element.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;

        // Scroll to the element
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    [],
  );

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'hidden xl:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4',
        className,
      )}
      aria-label='Table of contents'
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(203 213 225) transparent',
      }}
    >
      <div className='space-y-2 pb-8'>
        <h4 className='font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wide'>
          On This Page
        </h4>
        <ul className='space-y-2 text-sm border-l-2 border-slate-200 dark:border-slate-700'>
          {tocItems.map((item) => (
            <li
              key={item.id}
              className={cn('transition-all duration-200', {
                'pl-4': item.level === 2,
                'pl-8': item.level === 3,
              })}
            >
              <a
                key={item.id}
                href={`#${item.id}`}
                // click function to handle smooth scrolling
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  'block py-2 text-sm transition-colors duration-200',
                  activeId === item.id ||
                    (item.id === 'introduction' && !activeId)
                    ? 'text-primary font-medium' // active state
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
                  item.level === 3 ? 'pl-2' : '', // indentation
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;
