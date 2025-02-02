import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import { getLayout } from '~/components/SiteLayout';
import matter from 'gray-matter';
import readingTime from 'reading-time';
const PATH = 'pages/blog/posts';
import TextTruncate from 'react-text-truncate';
import generateRssFeed from './generateRssFeed';
import { useRouter } from 'next/router';
import { SectionContext } from '~/context';
import Image from 'next/image';

type Author = {
  name: string;
  photo?: string;
  link?: string;
  byline?: string;
};
export type blogCategories =
  | 'All'
  | 'Community'
  | 'Case Study'
  | 'Engineering'
  | 'Update'
  | 'Opinion';

export async function getStaticProps({ query }: { query: any }) {
  const files = fs.readdirSync(PATH);
  const blogPosts = files
    .filter((file) => file.substr(-3) === '.md')
    .map((fileName) => {
      const slug = fileName.replace('.md', '');
      const fullFileName = fs.readFileSync(
        `pages/blog/posts/${slug}.md`,
        'utf-8',
      );
      const { data: frontmatter, content } = matter(fullFileName);
      return {
        slug: slug,
        frontmatter,
        content,
      };
    });

  await generateRssFeed(blogPosts);

  const filterTag: string = query?.type || 'All';

  return {
    props: {
      blogPosts,
      filterTag,
    },
  };
}

function isValidCategory(category: any): category is blogCategories {
  return [
    'All',
    'Community',
    'Case Study',
    'Engineering',
    'Update',
    'Opinion',
  ].includes(category);
}

export default function StaticMarkdownPage({
  blogPosts,
  filterTag,
}: {
  blogPosts: any[];
  filterTag: any;
}) {
  const router = useRouter();
  const [currentFilterTag, setCurrentFilterTag] = useState<blogCategories>(
    filterTag || 'All',
  );

  useEffect(() => {
    const { query } = router;
    if (query.type && isValidCategory(query.type)) {
      setCurrentFilterTag(query.type);
    }
  }, [router.query]);

  useEffect(() => {
    // Set the filter tag based on the initial query parameter when the page loads
    setCurrentFilterTag(filterTag);
  }, [filterTag]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default scrolling behavior
    const clickedTag = event.currentTarget.value as blogCategories;
    if (clickedTag === 'All') {
      setCurrentFilterTag('All');
      history.replaceState(null, '', '/blog'); // Update the URL without causing a scroll
    } else if (isValidCategory(clickedTag)) {
      setCurrentFilterTag(clickedTag);
      history.replaceState(null, '', `/blog?type=${clickedTag}`); // Update URL
    }
  };
  const recentBlog = blogPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateA < dateB ? 1 : -1;
  });

  const timeToRead = Math.ceil(readingTime(recentBlog[0].content).minutes);
  const setOfTags: any[] = blogPosts.map((tag) => tag.frontmatter.type);
  const spreadTags: any[] = [...setOfTags];
  const allTags = [...new Set(spreadTags)];
  //add tag for all
  allTags.unshift('All');

  return (
    // @ts-ignore
    <SectionContext.Provider value='blog'>
      <Head>
        <title>JSON Schema Blog</title>
      </Head>
      <div className='max-w-[1400px] mx-auto overflow-x-hidden flex flex-col items-center mt-10 '>
        {recentBlog[0] && (
          <div className='relative w-full h-[400px] bg-black clip-bottom mt-1.5 flex flex-col items-center justify-start dark:bg-slate-700'>
            <div className='absolute w-full h-full dark:bg-[#282d6a]'>
              <Image
                src={recentBlog[0].frontmatter.cover}
                width={800}
                height={450}
                className='object-cover w-full h-full opacity-70'
                alt='hero image example'
              />
            </div>
            <div className='absolute text-white w-full h-full mt-custom ml-14'>
              <div className='bg-blue-100 hover:bg-blue-200 font-semibold text-blue-800 inline-block px-3 py-1 rounded-full my-3 text-sm'>
                {recentBlog[0].frontmatter.type}
              </div>
              <Link href={`/blog/posts/${recentBlog[0].slug}`}>
                <h1 className='text-h1mobile ab1:text-h1 sm:text-h2 font-semibold text-stroke-1 mr-6 dark:slate-300'>
                  {recentBlog[0].frontmatter.title}
                </h1>
                <div className='flex ml-2 mb-2'>
                  <div
                    className='bg-slate-50 h-10 w-10 lg:h-[44px] lg:w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                    style={{
                      backgroundImage: `url(${recentBlog[0].frontmatter.authors[0].photo})`,
                    }}
                  />

                  <div className='max-w-full lg:max-w-[calc(100% - 64px)] mx-auto lg:mx-0 flex-col ml-2'>
                    <p className='text-sm font-semibold text-stroke-1'>
                      {recentBlog[0].frontmatter.authors[0].name}
                    </p>
                    <div className='mb-6 text-sm  text-stroke-1'>
                      <span>
                        {recentBlog[0].frontmatter.date} &middot; {timeToRead}{' '}
                        min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
        <div className='w-full mx-auto my-5'>
          <div className='flex h-full flex-col justify-center items-center mb-3 my-2'>
            <h2 className='text-h3mobile md:text-h3 font-bold px-4 items-center text-center'>
              Welcome to the JSON Schema Blog!
            </h2>
          </div>

          <div className='flex h-full flex-col justify-center items-center text-center text-sm sm:text-base px-4 my-2'>
            <p>
              Want to publish a blog post? Check out the&nbsp;
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/json-schema-org/community/blob/main/docs/blog-guidelines.md'
                className='underline'
              >
                guidelines
              </a>
              &nbsp;and submit yours!
            </p>
          </div>

          <div className='flex h-full flex-col justify-center items-center text-sm sm:text-base px-4 my-2'>
            <a
              href='/rss/feed.xml'
              className='flex items-center text-blue-500 hover:text-blue-600 cursor-pointer'
            >
              <Image
                src='/icons/rss.svg'
                className='rounded h-5 w-5 mr-2'
                alt='rss'
                height={20}
                width={20}
              />
              RSS&nbsp;Feed
            </a>
          </div>
        </div>
        {/* Filter Buttons */}

        <div className='w-full ml-8 flex flex-wrap justify-start'>
          {allTags.map((tag) => (
            <button
              key={tag}
              value={tag}
              onClick={handleClick}
              className={`cursor-pointer 
			          font-semibold inline-block px-3 py-1 4
			          rounded-full mb-4 mr-4 text-sm 
			          ${currentFilterTag === tag ? 'dark:bg-blue-200 dark:text-slate-700 bg-blue-800 text-blue-100' : 'dark:bg-slate-700 dark:text-blue-100 bg-blue-100 text-blue-800 hover:bg-blue-200 hover:dark:bg-slate-600'}`}
            >
              {tag}
            </button>
          ))}
          <span className='text-blue-800 inline-block px-3 py-1 mb-4 mr-4 text-sm items-center dark:text-slate-300'>
            Filter blog posts by category...
          </span>
        </div>

        {/* filterTag === frontmatter.type &&  */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 bg-white dark:bg-slate-800 mx-auto p-6'>
          {blogPosts
            .filter((post) => {
              if (!currentFilterTag || currentFilterTag === 'All') return true;
              const blogType = post.frontmatter.type as string | undefined;
              if (!blogType) return false;
              return blogType.toLowerCase() === currentFilterTag.toLowerCase();
            })
            .sort((a, b) => {
              const dateA = new Date(a.frontmatter.date).getTime();
              const dateB = new Date(b.frontmatter.date).getTime();
              return dateA < dateB ? 1 : -1;
            })
            .map((blogPost: any) => {
              const { frontmatter, content } = blogPost;
              const timeToRead = Math.ceil(readingTime(content).minutes);

              return (
                <section key={blogPost.slug}>
                  <div className='h-[520px] flex border rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden dark:border-slate-500 group relative'>
                    <div className='inline-flex flex-col flex-1 w-full'>
                      <div className='relative w-full h-[240px] overflow-hidden'>
                        <Image
                          src={frontmatter.cover}
                          fill
                          className='object-cover transition-transform duration-300 group-hover:scale-105'
                          alt={frontmatter.title}
                        />
                      </div>
                      <div className='p-4 flex flex-col flex-1 justify-between'>
                        <div>
                          <div className='bg-blue-100 dark:bg-slate-700 dark:text-blue-100 font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 text-sm'>
                            {frontmatter.type || 'Unknown Type'}
                          </div>
                          <div className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300'>
                            {frontmatter.title}
                          </div>
                          <div className='mt-3 mb-6 text-slate-500 dark:text-slate-300'>
                            <TextTruncate
                              element='span'
                              line={3}
                              text={frontmatter.excerpt}
                            />
                          </div>
                          <div className='mb-4'></div>
                          <div className='flex items-center'>
                            <div className='flex flex-row pl-2 mr-2'>
                              {(frontmatter.authors || []).map(
                                (author: Author, index: number) => (
                                  <div
                                    key={index}
                                    className={`bg-slate-50 rounded-full -ml-3 bg-cover bg-center border-2 border-white ${
                                      frontmatter.authors.length > 2
                                        ? 'h-8 w-8'
                                        : 'h-11 w-11'
                                    }`}
                                    style={{
                                      backgroundImage: `url(${author.photo})`,
                                      zIndex: 10 - index,
                                    }}
                                  />
                                ),
                              )}
                            </div>
                            <div className='text-sm font-semibold dark:text-slate-300 mb-2'>
                              {frontmatter.authors.length > 2 ? (
                                <>
                                  {frontmatter.authors
                                    .slice(0, 2)
                                    .map((author: Author, index: number) => (
                                      <span key={author.name}>
                                        {author.name}
                                        {index === 0 && ' & '}
                                      </span>
                                    ))}
                                  {'...'}
                                </>
                              ) : (
                                frontmatter.authors.map(
                                  (author: Author, index: number) => (
                                    <span key={author.name}>
                                      {author.name}
                                      {index < frontmatter.authors.length - 1 &&
                                        ' & '}
                                    </span>
                                  ),
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between pt-4 mt-4 border-t dark:border-slate-600'>
                          <span className='text-sm text-slate-500 dark:text-slate-300'>
                            {timeToRead} min read
                          </span>
                          <Link
                            href={`/blog/posts/${blogPost.slug}`}
                            className='text-blue-600 dark:text-blue-400 font-medium flex items-center hover:translate-x-1 transition-transform duration-300'
                          >
                            Read More
                            <svg
                              className='ml-1 w-4 h-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5l7 7-7 7'
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
        </div>
      </div>
    </SectionContext.Provider>
  );
}

StaticMarkdownPage.getLayout = getLayout;
