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
import useSetUrlParam from '~/lib/useSetUrlParam';
import { SectionContext } from '~/context';

export type blogCategories =
  | 'All'
  | 'Community'
  | 'Case Study'
  | 'Engineering'
  | 'Update'
  | 'Opinion';

export async function getStaticProps({
  query,
}: {
  params: string;
  query: any;
}) {
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
  const setParam = useSetUrlParam();
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

  const handleClick = (event: { currentTarget: { value: any } }) => {
    const clickedTag = event.currentTarget.value;

    setCurrentFilterTag(clickedTag);

    // Check if the user is already on the "/blog" page
    if (router.pathname === '/blog') {
      if (router.query.type) {
        // Remove the 'type' query parameter from the URL
        setParam('type', null);
      }
      setCurrentFilterTag(clickedTag);
    } else {
      // If not on the "/blog" page, navigate to the "/blog" page with the type tag as a query parameter
      router.replace(
        { pathname: '/blog', query: { type: clickedTag } },
        undefined,
        { shallow: true },
      );
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
      <div className='max-w-[1400px] mx-auto flex flex-col items-center mt-10 overflow-x-hidden'>
        {recentBlog[0] && (
          <div className='relative w-full  h-[400px] bg-black clip-bottom mt-1.5 flex flex-col items-center justify-start'>
            <div className='absolute w-full h-full '>
              <img
                src={recentBlog[0].frontmatter.cover}
                className='object-cover w-full h-full opacity-70'
                alt='hero image example'
              />
            </div>
            <div className='absolute h-full w-full text-white mt-custom ml-14 '>
              <div className='bg-blue-100 hover:bg-blue-200 font-semibold text-blue-800 inline-block px-3 py-1 rounded-full my-3 text-sm'>
                {recentBlog[0].frontmatter.type}
              </div>
              <Link href={`/blog/posts/${recentBlog[0].slug}`}>
                <h1 className='text-h1mobile ab1:text-h1 sm:text-h2 font-semibold text-stroke-1 mr-6'>
                  {recentBlog[0].frontmatter.title}
                </h1>
                <div className='flex ml-2 mb-2 '>
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
                    <div className=' mb-6 text-sm  text-stroke-1'>
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
              <img src='/icons/rss.svg' className='rounded h-5 w-5 mr-2' />
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
              className='bg-blue-100 hover:bg-blue-200 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 mr-4 text-sm'
            >
              {tag}{' '}
            </button>
          ))}
          <span className='text-blue-800 inline-block px-3 py-1 mb-4 mr-4 text-sm items-center'>
            Filter blog posts by category...
          </span>
        </div>

        {/* filterTag === frontmatter.type &&  */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 grid-flow-row mb-20 bg-white  mx-auto p-4'>
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
              const date = new Date(frontmatter.date);
              const timeToRead = Math.ceil(readingTime(content).minutes);

              return (
                <section key={blogPost.slug}>
                  <div className='h-[498px] flex border rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden'>
                    <Link
                      href={`/blog/posts/${blogPost.slug}`}
                      className='inline-flex flex-col flex-1 w-full'
                    >
                      <div
                        className='bg-slate-50 h-[160px] w-full self-stretch mr-3 bg-cover bg-center'
                        style={{ backgroundImage: `url(${frontmatter.cover})` }}
                      />
                      <div className=' p-4 flex flex-col flex-1 justify-between'>
                        <div>
                          <div>
                            <div
                              className='bg-blue-100 hover:bg-blue-200 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 text-sm'
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setParam('type', frontmatter.type);
                              }}
                            >
                              {frontmatter.type}
                            </div>
                          </div>
                          <div className='text-lg font-semibold'>
                            {frontmatter.title}
                          </div>
                          <div className='mt-3 mb-6 text-slate-500'>
                            <TextTruncate
                              element='span'
                              line={4}
                              text={frontmatter.excerpt}
                            />
                          </div>
                        </div>
                        <div className='flex flex-row items-center'>
                          <div className='flex flex-row pl-2 mr-2'>
                            {(frontmatter.authors || []).map(
                              (author: any, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                                    style={{
                                      backgroundImage: `url(${author.photo})`,
                                      zIndex: 10 - index,
                                    }}
                                  />
                                );
                              },
                            )}
                          </div>

                          <div className='flex flex-col items-start'>
                            <div className='text-sm font-semibold'>
                              {frontmatter.authors
                                .map((author: any) => author.name)
                                .join(' & ')}
                            </div>

                            <div className='text-slate-500 text-sm'>
                              {frontmatter.date && (
                                <span>
                                  {date.toLocaleDateString('en-us', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}{' '}
                              &middot; {timeToRead} min read
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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
