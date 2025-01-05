import React, { useState, useEffect } from 'react';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import Markdown from 'markdown-to-jsx';

// Utility function to extract text from children for slug generation
const getTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map((child) => getTextFromChildren(child)).join('');
  }
  return '';
};

// Helper function to hide elements like strong, p, etc. from the TOC
const hiddenElements = (...elements: string[]) => {
  return elements.reduce((acc, element) => {
    return {
      ...acc,
      [element]: { component: () => null },
    };
  }, {});
};

// HeadingLink component to render each heading with a link
const HeadingLink: React.FC<{
  level: number;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ level, isActive, children }) => {
  const text = getTextFromChildren(children); // Get the plain text for slug
  const slug = slugifyMarkdownHeadline(text); // Generate slug from text
  const paddingClass = `pl-${level * 2}`; // Adjust padding based on heading level
  const activeClass = isActive ? 'text-primary font-semibold' : ''; // Add active class if the heading is active

  return (
    <a
      href={`#${slug}`}
      className={`block cursor-pointer mb-3 text-slate-600 dark:text-slate-300 leading-${level + 4} font-medium ${paddingClass} ${activeClass}`}
    >
      {children}
    </a>
  );
};

interface TableOfContentMarkdownProps {
  markdown: string;
  depth?: number;
}

export const TableOfContentMarkdown: React.FC<TableOfContentMarkdownProps> = ({
  markdown,
  depth = 2,
}) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4');
      let found = false;
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i] as HTMLElement;
        if (heading.offsetTop <= window.scrollY + 100) {
          setActiveSlug(heading.id);
          found = true;
        }
        if (!found) {
          setActiveSlug(null); // Reset active state if no heading is visible
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='w-2/5 lg:block mt-10 hidden sticky top-24 h-[calc(100vh-6rem)] overflow-hidden'>
      <div className='h-full overflow-y-auto scrollbar-hidden pl-5'>
        <div className='uppercase text-xs text-slate-400 mb-4'>
          On this page
        </div>
        <Markdown
          options={{
            overrides: {
              h1: {
                component: ({ children }) => (
                  <HeadingLink
                    level={0}
                    isActive={
                      activeSlug ===
                      slugifyMarkdownHeadline(getTextFromChildren(children))
                    }
                  >
                    {children}
                  </HeadingLink>
                ),
              },
              h2: {
                component:
                  depth >= 3
                    ? ({ children }) => (
                        <HeadingLink
                          level={0}
                          isActive={
                            activeSlug ===
                            slugifyMarkdownHeadline(
                              getTextFromChildren(children),
                            )
                          }
                        >
                          {children}
                        </HeadingLink>
                      )
                    : () => null,
              },
              h3: {
                component:
                  depth >= 3
                    ? ({ children }) => (
                        <HeadingLink
                          level={1}
                          isActive={
                            activeSlug ===
                            slugifyMarkdownHeadline(
                              getTextFromChildren(children),
                            )
                          }
                        >
                          {children}
                        </HeadingLink>
                      )
                    : () => null,
              },
              h4: {
                component:
                  depth >= 3
                    ? ({ children }) => (
                        <HeadingLink
                          level={2}
                          isActive={
                            activeSlug ===
                            slugifyMarkdownHeadline(
                              getTextFromChildren(children),
                            )
                          }
                        >
                          {children}
                        </HeadingLink>
                      )
                    : () => null,
              },
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
              ),
            },
          }}
        >
          {markdown}
        </Markdown>
      </div>
    </div>
  );
};

export const TableOfContentLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className='max-w-[1400px] mx-auto flex flex-col items-center'>
      <section className='relative'>
        {/* TOC on the left */}
        <div className='w-2/5 lg:block mt-10 sticky top-24 h-[calc(100vh-6rem)] overflow-hidden'>
          <TableOfContentMarkdown markdown={String(children)} depth={2} />
        </div>
        {/* Main content on the right */}
        <div className='col-span-4 md:col-span-3 lg:mt-20 mx-4 md:mx-0'>
          {children}
        </div>
      </section>
    </div>
  );
};
