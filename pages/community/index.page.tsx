import React, { useMemo } from 'react';
import { getLayout } from '~/components/SiteLayout';
import { SectionContext } from '~/context';
import fs from 'fs';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import { GetStaticProps } from 'next';
import Card from '~/components/Card';
import Image from 'next/image';
import ical from 'node-ical';
import {
  fetchRemoteICalFile,
  printEventsForNextWeeks,
} from '../../lib/calendarUtils';

export const getStaticProps: GetStaticProps = async () => {
  const PATH = 'pages/blog/posts';
  const files = fs.readdirSync(PATH);

  const blogPosts = files
    .filter((file) => file.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace('.md', '');
      const fullFileName = fs.readFileSync(`${PATH}/${slug}.md`, 'utf-8');
      const { data: frontmatter, content } = matter(fullFileName);
      return {
        slug,
        frontmatter,
        content,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateA < dateB ? 1 : -1;
    })
    .slice(0, 5);

  // Fetch contributors from GitHub
  const contributorsRes = await fetch(
    'https://api.github.com/repos/json-schema-org/json-schema-org.github.io/contributors?per_page=100',
  );

  const contributors = await contributorsRes.json();

  const imageData = contributors.map((contributor: any) => ({
    id: contributor.id,
    login: contributor.login,
    avatar_url: contributor.avatar_url,
    html_url: contributor.html_url,
  }));

  const remoteICalUrl =
    'https://calendar.google.com/calendar/ical/json.schema.community%40gmail.com/public/basic.ics';

  const datesInfo = await fetchRemoteICalFile(remoteICalUrl)
    .then((icalData: any) => printEventsForNextWeeks(ical.parseICS(icalData)))
    .catch(() => []);

  return {
    props: {
      blogPosts,
      datesInfo,
      imageData,
    },
  };
};

function CommunityPages({ blogPosts, datesInfo, imageData }: any) {
  const timeToRead = Math.ceil(readingTime(blogPosts[0].content).minutes);

  // Shuffle contributors on every render
  const shuffledContributors = useMemo(() => {
    return imageData
      .filter(
        (contributor: any) =>
          contributor.login !== 'the-json-schema-bot[bot]' &&
          contributor.login !== 'dependabot[bot]',
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 60);
  }, [imageData]);

  return (
    <SectionContext.Provider value='community'>
      <div className='max-w-screen-xl block px-4 sm:px-6 lg:px-8 mx-auto w-full'>
        <div className='grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[100vh]'>
          {/* Left Section */}
          <div className='grid items-center mx-auto mt-[100px]'>
            <div className='text-center flex flex-col items-center'>
              <h2 className='text-[2.5rem] font-bold'>
                Welcome to the
                <br />
                JSON Schema Community
              </h2>

              <h2 className='text-gray-700 text-xl mt-5 w-5/6'>
                Join the Community to learn, share ideas, ask questions, build
                JSON Schema tooling, and get involved in the future of the
                specifications.
              </h2>

              <div className='mt-8'>
                <button
                  className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded'
                  onClick={() =>
                    window.open(
                      'https://github.com/orgs/json-schema-org/discussions',
                      '_self',
                    )
                  }
                >
                  Join Discussions
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Contributors */}
          <div className='grid justify-center items-center'>
            <div className='grid grid-cols-10 gap-3 mt-[50px]'>
              {shuffledContributors.map((avatar: any, index: number) => (
                <a
                  key={`${avatar.id}-${index}`}
                  href={avatar.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  title={avatar.login}
                >
                  <Image
                    src={avatar.avatar_url}
                    alt={avatar.login}
                    width={50}
                    height={50}
                    priority={index < 10}
                    className='rounded-full border-2 border-transparent 
           hover:border-blue-600 
           transition-all duration-200 
           hover:scale-110'
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <section className='mt-10'>
          <div className='flex flex-row justify-between gap-4  max-sm:flex-col max-lg:gap-8 md:w-11/12 lg:w-10/12 xl:w-10/12 m-auto'>
            <Card
              key='roadmap'
              icon='/icons/roadmap.svg'
              title='Roadmap'
              body='Explore our exciting plans and upcoming milestones. 🚀'
              headerSize='large'
              bodyTextSize='medium'
              link='/overview/roadmap'
            />
            <Card
              key='contribute'
              icon='/icons/contribute.svg'
              title='Contribute'
              body='We are looking forward to working with you. Welcome aboard!'
              headerSize='large'
              bodyTextSize='medium'
              link='https://github.com/json-schema-org/.github/blob/main/CONTRIBUTING.md'
            />
          </div>
        </section>
        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <div className='z-40 mt-20 mx-auto w-full md:h-[520px] md:flex grid grid-cols-1 lg:grid-cols-2 md:justify-between rounded-lg border border-gray-200 bg-white transition-colors hover:bg-slate-100 dark:bg-slate-800 hover:dark:bg-slate-900/30 shadow-3xl dark:shadow-2xl dark:shadow-slate-900'>
            <div className='p-4 px-8 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div data-testid='HomeCard-main' className='m-auto'>
                <h2 className=' text-blue-700 font-bold  text-[2rem] text-center'>
                  Ambassadors Program
                </h2>
                <h2 className='text-center font-bold text-slate-500 text-base tracking-wide dark:text-white mt-10'>
                  The JSON Schema Ambassadors Program recognize the people who
                  drive adoption, innovation and knowledge sharing in the JSON
                  Schema community.
                </h2>
                <div
                  className='mt-10 mx-auto flex justify-center items-center'
                  data-testid='HomeCard-button'
                >
                  <Link
                    href='/ambassadors'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                  >
                    Become an ambassador
                  </Link>
                </div>
              </div>
            </div>
            <div className='w-full h-fit-content md:w-3/6 max-sm:w-1/4 flex rounded-r-lg justify-end bg-cover bg-center bg-ambassador' />
          </div>

          <div className='z-40 mt-20 rounded-lg border border-gray-200 bg-white transition-colors hover:bg-slate-100 mx-auto w-full md:h-[520px] md:flex grid grid-cols-1 lg:grid-cols-2 md:justify-between dark:bg-slate-800 hover:dark:bg-slate-900/30 shadow-3xl dark:shadow-2xl dark:shadow-slate-900'>
            <div className='p-4 px-8 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div
                data-testid='HomeCard-main'
                className='m-auto flex flex-col items-center text-center'
              >
                <h2 className='text-blue-700 font-bold text-[2rem]'>
                  Join the JSON Schema Slack workspace!
                </h2>
                <h2 className='font-bold text-base text-slate-500 dark:text-white tracking-wide mt-10'>
                  Join our Slack to ask questions, get feedback on your
                  projects, and connect with +5000 practitioners and experts.
                </h2>
                <div className='mt-10'>
                  <Link
                    href='/slack'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                  >
                    Join Slack
                  </Link>
                </div>
              </div>
            </div>
            <div className='w-full h-fit-content md:w-3/6  flex rounded-r-lg justify-end bg-cover bg-center bg-slack' />
          </div>
        </div>

        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <div className='z-40 mt-20 w-full rounded-lg border border-gray-200 bg-white group dark:bg-slate-800 hover:dark:bg-slate-900/30 shadow-3xl dark:shadow-2xl dark:shadow-slate-900 transition-colors hover:bg-slate-100 md:flex grid grid-cols-1 lg:grid-cols-2 justify-between'>
            <div className='p-4 px-8 grid items-center w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div data-testid='HomeCard-main'>
                <h2 className='text-blue-700 text-[2rem] font-bold  text-center'>
                  JSON Schema Community Meetings & Events
                </h2>
                <div
                  className='mt-10 text-center'
                  data-testid='HomeCard-button'
                >
                  <h2 className='text-slate-500 text-base tracking-wide dark:text-white mt-10 font-bold text-body-lg tracking-body font-regular'>
                    We hold monthly Office Hours and weekly Open Community
                    Working Meetings. Office Hours are every first Tuesday of
                    the month at 15:00 BST, and by appointment. Open Community
                    Working Meetings are every Monday at 14:00 PT.
                  </h2>
                  <div className='mt-10 flex justify-center'>
                    <a
                      href='https://github.com/orgs/json-schema-org/discussions/35'
                      rel='noopener noreferrer'
                      className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                    >
                      Open Community Working Meetings
                    </a>
                  </div>
                  <div className='mt-4 flex justify-center'>
                    <a
                      href='https://github.com/orgs/json-schema-org/discussions/34/'
                      rel='noopener noreferrer'
                      className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                    >
                      Office Hours
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-fit-content h-fit-content py-3 md:w-3/6 max-lg:mx-3 flex rounded-r-lg justify-end'>
              <div className='mx-auto max-lg:w-full'>
                <h2 className='text-center dark:text-white text-primary text-[2rem] font-bold '>
                  Upcoming events
                </h2>
                {datesInfo.map((event: any, index: any) => (
                  <div
                    key={index}
                    className='mx-auto gap-2 group-hover:bg-white dark:bg-slate-900/50 dark:group-hover:bg-slate-800  bg-slate-100 h-[90px] max-md:h-[120px]  max-sm:h-auto  w-full rounded-lg flex flex-row justify-between  items-center p-2 mt-2'
                  >
                    <div
                      className={`h-[70px] w-1/3 rounded-lg text-center grid items-center bg-index-${index}`}
                    >
                      <p className='text-[2rem] dark:text-white'>{event.day}</p>
                    </div>
                    <div className='h-[70px] max-md:h-[120px]   max-sm:h-auto w-2/3  rounded-lg grid items-center px-2'>
                      <p className='text-[12px]  dark:text-white'>
                        <b className='text-blue-700'>{event.title}</b>
                        <br />
                        <span>
                          {event.time}({event.timezone})
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <div className='z-40 mt-20 w-full md:h-130 rounded-lg border border-gray-200 bg-white shadow-3xl transition-colors  hover:bg-slate-100 md:flex grid grid-cols-1 md:grid-cols-2 justify-between mb-10  dark:bg-slate-800 hover:dark:bg-slate-900/30  dark:shadow-2xl dark:shadow-slate-900'>
            <div className='p-4 px-8 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div data-testid='HomeCard-main' className='mx-auto my-20'>
                <h2 className=' text-blue-700 font-bold text-[2rem] text-center'>
                  Welcome to
                  <br />
                  the JSON Schema Blog!
                </h2>
                <div className='m-auto flex flex-col items-center text-center'>
                  <h2 className='font-bold text-slate-500 text-base dark:text-white tracking-wide mt-10'>
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
                  </h2>
                  <div className='mt-10'>
                    <Link
                      href='/blog'
                      rel='noopener noreferrer'
                      className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                    >
                      Read blog
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className='p-10 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left '>
              <div className='w-full mb-6 '>
                <Link href={`/blog/posts/${blogPosts[0].slug}`}>
                  <Image
                    src={blogPosts[0].frontmatter.cover}
                    className='w-full h-[232px]  mb-4'
                    height={232}
                    width={400}
                    alt={blogPosts[0].frontmatter.title}
                  />
                  <h3 className='mb-4 font-semibold dark:text-white'>
                    {blogPosts[0].frontmatter.title}
                  </h3>
                  <div className='mb-4 text-[14px] dark:text-white'>
                    <TextTruncate
                      element='span'
                      line={4}
                      text={blogPosts[0].frontmatter.excerpt}
                    />
                  </div>
                  <div className='flex ml-2 mb-2 '>
                    {(blogPosts[0].frontmatter.authors || []).map(
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
                    <div className='flex flex-col ml-2'>
                      <p className='text-sm font-semibold dark:text-white'>
                        {blogPosts[0].frontmatter.authors.length > 2 ? (
                          <>
                            {blogPosts[0].frontmatter.authors
                              .slice(0, 2)
                              .map((author: any, index: number) => (
                                <span key={author.name}>
                                  {author.name}
                                  {index === 0 && ' & '}
                                </span>
                              ))}
                            {'...'}
                          </>
                        ) : (
                          blogPosts[0].frontmatter.authors.map(
                            (author: any) => (
                              <span key={author.name}>{author.name}</span>
                            ),
                          )
                        )}
                      </p>
                      <div className='dark:text-slate-300 text-sm'>
                        <span>
                          {blogPosts[0].frontmatter.date} &middot;{timeToRead}{' '}
                          min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className='mx-auto '>
                  <Link
                    href='/blog'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none mt-4'
                  >
                    Read more posts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}
CommunityPages.getLayout = getLayout;

export default CommunityPages;
