import React, { useContext, useEffect, useRef, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import { FullMarkdownContext } from '~/context';

interface TableOfContentMarkdownProps {
  markdown: string;
  depth?: number;
}

export function TableOfContentMarkdown({
  markdown,
  depth = 2,
}: TableOfContentMarkdownProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Ref to hold the headings and observe scroll behavior
  const headingsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id); // Update active section based on visible heading
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 1.0 }
    );

    headingsRef.current
      .filter(Boolean)
      .forEach((heading) => heading && observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const getHeadingClassName = (id: string, defaultClass: string) =>
    `${defaultClass} ${id === activeId ? 'text-blue-600 font-semibold' : ''}`;

  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children);
              return (
                <a
                  id={slug}
                  ref={(el) => (headingsRef.current[slug] = el)}
                  href={`#${slug}`}
                  className={getHeadingClassName(
                    slug,
                    'flex cursor-pointer mb-3 max-sm:text-sm text-slate-600 dark:text-slate-300 leading-6 font-medium'
                  )}
                >
                  {children}
                </a>
              );
            },
          },
          h2: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children);
              return (
                <a
                  id={slug}
                  ref={(el) => (headingsRef.current[slug] = el)}
                  href={`#${slug}`}
                  className={getHeadingClassName(
                    slug,
                    'block cursor-pointer mb-3 text-slate-600 dark:text-slate-300 leading-5 font-medium ml-4'
                  )}
                >
                  {children}
                </a>
              );
            },
          },
          h3: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children);
              return (
                <a
                  id={slug}
                  ref={(el) => (headingsRef.current[slug] = el)}
                  href={`#${slug}`}
                  className={getHeadingClassName(
                    slug,
                    'relative block cursor-pointer mb-3 text-slate-600 dark:text-slate-300 leading-4 ml-6'
                  )}
                >
                  {children}
                </a>
              );
            },
          },
          h4: {
            component: ({ children }) => {
              const slug = slugifyMarkdownHeadline(children);
              return (
                <a
                  id={slug}
                  ref={(el) => (headingsRef.current[slug] = el)}
                  href={`#${slug}`}
                  className={getHeadingClassName(
                    slug,
                    'flex flex-row items-center cursor-pointer mb-3 text-slate-600 dark:text-slate-300 leading-3 ml-8'
                  )}
                >
                  {children}
                </a>
              );
            },
          },
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}