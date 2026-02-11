import React, { useContext, useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import { hiddenElements } from '~/lib/markdownUtils';
import { FullMarkdownContext } from '~/context';

interface TableOfContentMarkdownProps {
  markdown: string;
  depth?: number;
}

export function TableOfContentMarkdown({
  markdown,
  depth = 2,
}: TableOfContentMarkdownProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const HEADLINE_SELECTOR =
      '[data-test="headline"], h1[id], h2[id], h3[id], h4[id]';
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(HEADLINE_SELECTOR),
    );

    if (!sections.length) return;

    let observer: IntersectionObserver | null = null;
    let ticking = false;

    const updateActive = (id: string | null) => {
      setActiveSection((prev) => (prev === id ? prev : id));
    };

    const getOffset = () => {
      const cssVal = getComputedStyle(document.documentElement)
        .getPropertyValue('--toc-offset')
        .trim();
      const val = parseInt(cssVal, 10);
      return Number.isFinite(val) ? val : 180;
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const offset = getOffset();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target.id);
          if (visible.length > 0) {
            updateActive(visible[0]);
          }
        },
        { rootMargin: `-${offset}px 0px -80% 0px`, threshold: [0, 1] },
      );
      sections.forEach((s) => observer?.observe(s));
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const offset = getOffset();
          const candidate = sections.find(
            (s) => s.getBoundingClientRect().top <= offset,
          );
          if (candidate) updateActive(candidate.id);
          ticking = false;
        });
      }
    };

    if (!observer) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Initial check
    const hash = window.location.hash.slice(1);
    if (hash) updateActive(hash);
    else onScroll();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [markdown]);

  const getSectionClassName = (slug: string, baseClass: string) =>
    `${baseClass} ${activeSection === slug ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`;

  const renderHeading = (
    Wrapper: any,
    children: any,
    slug: string,
    className: string,
  ) => (
    <a href={`#${slug}`} className={getSectionClassName(slug, className)}>
      {Wrapper}
      {children}
    </a>
  );

  let h2Override;
  if (depth >= 2 || depth === 0) {
    h2Override = {
      component: ({ children }: { children: React.ReactNode }) =>
        renderHeading(
          depth >= 2 && (
            <span className='mr-1 text-blue-400 text-[0.7em]'>&#9679;</span>
          ),
          children,
          slugifyMarkdownHeadline(children as any),
          `block cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 font-medium ${depth === 0 ? 'ml-4' : 'max-sm:-ml-[6px] -ml-[6.5px]'}`,
        ),
    };
  } else {
    h2Override = { component: () => null };
  }

  let h3Override;
  if (depth >= 3) {
    h3Override = {
      component: ({ children }: { children: React.ReactNode }) =>
        renderHeading(
          <>
            <span className='text-blue-400/40 font-extrabold text-[0.8em] max-sm:text-[1.2em] ml-1'>
              &mdash;&mdash;
            </span>
            <span className='mr-1 text-blue-400/90 text-[0.7em] flex justify-center items-center'>
              &#9679;
            </span>
          </>,
          children,
          slugifyMarkdownHeadline(children as any),
          'flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem]',
        ),
    };
  } else {
    h3Override = { component: () => null };
  }

  let h4Override;
  if (depth >= 4) {
    h4Override = {
      component: ({ children }: { children: React.ReactNode }) =>
        renderHeading(
          <>
            <span className='text-blue-400/40 font-extrabold text-[0.8em] ml-1 max-sm:text-[1.2em]'>
              &mdash;&mdash;&mdash;&mdash;
            </span>
            <span className='mr-1 text-blue-400/90 text-[0.7em] flex justify-center items-center'>
              &#9679;
            </span>
          </>,
          children,
          slugifyMarkdownHeadline(children as any),
          'flex flex-row items-center cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-4 ml-[-0.25rem]',
        ),
    };
  } else {
    h4Override = { component: () => null };
  }

  const overrides = {
    h1: {
      component: ({ children }: { children: React.ReactNode }) =>
        renderHeading(
          null,
          children,
          slugifyMarkdownHeadline(children as any),
          'flex cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-6 font-medium',
        ),
    },
    h2: h2Override,
    h3: h3Override,
    h4: h4Override,
    ...hiddenElements(
      'strong',
      'p',
      'a',
      'ul',
      'li',
      'table',
      'code',
      'pre',
      'blockquote',
      'span',
      'div',
      'figure',
      'Bigquote',
      'Regularquote',
      'specialBox',
      'Infobox',
      'Danger',
      'Warning',
      'Tip',
    ),
  };

  return <Markdown options={{ overrides }}>{markdown}</Markdown>;
}

interface TableOfContentProps {
  depth?: number;
}

export const TableOfContent = ({ depth }: TableOfContentProps) => {
  const fullMarkdown = useContext(FullMarkdownContext);
  if (!fullMarkdown) return null;
  return (
    <>
      <div className='flex flex-row gap-2 text-slate-600 dark:text-slate-300 text-h5 max-sm:text-[1rem] items-center'>
        <Image
          src={'/icons/toc-menu.svg'}
          height={'15'}
          width={'15'}
          alt='menu-icon'
          className='max-sm:w-3 max-sm:h-3'
        />
        <span>Table of Contents</span>
      </div>
      <div className='mt-2 bg-slate-50 dark:bg-slate-900 pt-6 pb-3 pr-3 border border-r-0 border-y-0 border-l-blue-400/40 border-l-[2.5px]'>
        <TableOfContentMarkdown markdown={fullMarkdown} depth={depth} />
      </div>
    </>
  );
};
