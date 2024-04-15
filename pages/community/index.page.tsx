import React from 'react';
import { getLayout } from '~/components/SiteLayout';
import { SectionContext } from '~/context';
import imageData from './config/imageData.json';
import fs from 'fs';
import matter from 'gray-matter';
const PATH = 'pages/blog/posts';
import readingTime from 'reading-time';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import { GetStaticProps } from 'next';
import Card from '~/components/Card';

/* eslint-disable */
import axios from 'axios';
import ical from 'node-ical';
import moment from 'moment-timezone';

/* eslint-enable */
export const getStaticProps: GetStaticProps = async () => {
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
    })
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateA < dateB ? 1 : -1;
    })
    .slice(0, 5);

  // Function to fetch the remote iCal file
  async function fetchRemoteICalFile(url: string) {
    try {
      const response = await axios.get(url, { method: 'no-cors' });
      return response.data;
    } catch (error) {
      console.error('Error fetching iCal file:', error);
      return null;
    }
  }
  // Example usage:
  const remoteICalUrl =
    'https://calendar.google.com/calendar/ical/c_8r4g9r3etmrmt83fm2gljbatos%40group.calendar.google.com/public/basic.ics'; // Replace with the actual URL
  const datesInfo = await fetchRemoteICalFile(remoteICalUrl)
    .then((icalData) => printEventsForNextFourWeeks(ical.parseICS(icalData)))
    .catch((error) => console.error('Error:', error));
  // console.log('this is fetched data', datesInfo)
  return {
    props: {
      blogPosts,
      datesInfo,
      fallback: false,
    },
  };
};
// Function to filter and print events for the next 4 weeks from today
function printEventsForNextFourWeeks(icalData: { [x: string]: any }) {
  const arrayDates = [];
  if (!icalData) {
    console.error('iCal data is empty or invalid.');
    return;
  }

  // Calculate the range of dates for the next 4 weeks from today
  const today = moment().startOf('day');
  const nextFourWeeksEnd = moment().add(4, 'weeks').endOf('day');

  // Loop through the events in the iCal data
  for (const k in icalData) {
    const event = icalData[k];

    if (event.type === 'VEVENT') {
      const title = event.summary;

      const timezoneL = moment.tz.guess(); // Default to UTC if timezone information is not provided
      const startDate = moment.tz(event.start, timezoneL);

      // Complicated case - if an RRULE exists, handle multiple recurrences of the event.
      if (event.rrule !== undefined) {
        // For recurring events, get the set of event start dates that fall within the range
        // of dates we're looking for.
        const dates = event.rrule.between(
          today.toDate(),
          nextFourWeeksEnd.toDate(),
          true,
        );

        // Loop through the set of date entries to see which recurrences should be printed.
        for (const date of dates) {
          const startDate = moment.tz(date, timezoneL);

          // Check if the event falls within the next 4 weeks from today
          if (startDate.isBetween(today, nextFourWeeksEnd, undefined, '[]')) {
            const dateTimezone = moment.tz.zone(event.start.tz);
            const localTimezone = moment.tz.guess();
            const tz =
              event.rrule.origOptions.tzid === localTimezone
                ? event.rrule.origOptions.tzid
                : localTimezone;
            const timezone = moment.tz.zone(tz);
            let offset;
            if (timezone && dateTimezone)
              offset = timezone.utcOffset(date) - dateTimezone.utcOffset(date);
            const newDate = moment(date).add(offset, 'minutes').toDate();

            const start = moment(newDate);
            const utcDate = start.utc();

            const time = utcDate.format('MMMM Do YYYY, h:mm a');
            const day = utcDate.format('D');
            const parsedStartDate = utcDate.format('YYYY-MM-DD HH:mm:ss');
            arrayDates.push({
              title,
              time,
              day,
              timezone: 'UTC',
              parsedStartDate,
            });
          }
        }
      } else {
        // Simple case - no recurrences, just print out the calendar event.
        if (startDate.isBetween(today, nextFourWeeksEnd, undefined, '[]')) {
          const utcDate = startDate.utc();

          const time = utcDate.format('MMMM Do YYYY, h:mm a');
          const day = utcDate.format('D');
          const parsedStartDate = startDate.format('YYYY-MM-DD HH:mm:ss');
          arrayDates.push({
            title,
            time,
            day,
            timezone: 'UTC',
            parsedStartDate,
          });
        }
      }
    }
  }

  arrayDates.sort(
    (x, y) =>
      new Date(x.parsedStartDate).getTime() -
      new Date(y.parsedStartDate).getTime(),
  );

  return arrayDates;
}

export default function communityPages(props: any) {
  const blogPosts = props.blogPosts;
  const timeToRead = Math.ceil(readingTime(blogPosts[0].content).minutes);

  return (
    <SectionContext.Provider value='community'>
      <div
        className='max-w-screen-xl block px-4 sm:px-6 lg:px-8 mx-auto w-full'
        data-testid='Container-main'
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[100vh]'>
          <div className='grid items-center mx-auto mb-[20px] sm:w-[80%] lg:w-auto mt-[100px] '>
            <div
              className='text-center flex justify-center flex-col items-center mt-10 md:mt-0 w-fit h-fit'
              data-testid='Header-hero-heading'
            >
              <div className='mt-8' data-testid='Header-heading-1'>
                <h2 className='text-h3mobile md:text-h3 font-bold px-4 items-center text-center'>
                  Welcome to the
                  <br /> JSON Schema Community
                </h2>
              </div>
              <div className='mt-5 w-5/6' data-testid='Header-heading-2'>
                <h2 className='text-gray-700 text-sm font-heading dark:text-slate-100 text-body-md tracking-body font-regular '>
                  Join the Community to learn, share ideas, ask questions, build
                  JSON Schema tooling, and get involved in the future of the
                  Spec.
                </h2>
              </div>
              <div className='mt-8'>
                <button
                  className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
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
          <div className='grid justify-center items-center gap-y-[10px]'>
            <div className='grid  justify-center mt-[50px] gap-y-[10px]'>
              <div className='flex justify-start gap-x-[10px]'>
                {imageData[0].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full border-black'
                  />
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {imageData[1].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                  />
                ))}
              </div>
              <div className='flex justify-start gap-x-[10px]'>
                {imageData[2].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                  />
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {imageData[3].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                  />
                ))}
              </div>
              <div className='flex justify-start gap-x-[10px]'>
                {imageData[4].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                  />
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {imageData[5].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                  />
                ))}
              </div>
              <div className='flex justify-start gap-x-[10px]'>
                {imageData[6].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                  />
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {imageData[7].map((avatar, index) => (
                  <img
                    key={`${avatar.id}-${index}`}
                    src={avatar.img}
                    alt={avatar.alt}
                    className='w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <section className='mt-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12 m-auto'>
            <Card
              key='roadmap'
              icon='/icons/roadmap.svg'
              title='Roadmap'
              body='Explore our exciting plans and upcoming milestones. 🚀'
              headerSize='large'
              bodyTextSize='small'
              link='https://github.com/orgs/json-schema-org/discussions/427'
            />
            <Card
              key='contributing'
              icon='/icons/contribute.svg'
              title='Contributing'
              body='We are looking forward to working with you. Welcome aboard!'
              headerSize='large'
              bodyTextSize='small'
              link='https://github.com/json-schema-org/.github/blob/main/CONTRIBUTING.md'
            />
          </div>
        </section>
        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <div className='z-40 mt-20 mx-auto w-full md:h-[520px] md:flex grid grid-cols-1 lg:grid-cols-2 md:justify-between rounded-lg border border-gray-200 bg-white shadow-3xl transition-colors delay-[150ms] hover:bg-slate-100'>
            <div className='p-4 px-8 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div data-testid='HomeCard-main' className='m-auto'>
                <h2 className='font-heading text-heading-md text-blue-700 font-bold tracking-heading md:text-heading-lg text-[2rem] text-center'>
                  Ambassadors Program
                </h2>
                <h2 className='font-heading text-gray-700 text-heading-md font-bold tracking-heading md:text-heading-lg text-slate-500 text-sm mt-10'>
                  The JSON Schema Ambassadors Program recognize the people who
                  drive adoption, innovation and knowledge sharing in the JSON
                  Schema community.
                </h2>
                <div className='mt-10 mx-auto' data-testid='HomeCard-button'>
                  <a
                    href='#'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                  >
                    Become an ambassador
                  </a>
                </div>
              </div>
            </div>
            <div className='w-full h-fit-content md:w-3/6  flex rounded-r-lg justify-end bg-cover bg-center bg-ambassador' />
          </div>

          <div className='z-40 mt-20 rounded-lg border border-gray-200 bg-white shadow-3xl transition-colors delay-[150ms] hover:bg-slate-100 mx-auto w-full md:h-[520px] shadow-xl md:flex grid grid-cols-1 lg:grid-cols-2 md:justify-between'>
            <div className='p-4 px-8 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div data-testid='HomeCard-main' className='m-auto'>
                <h2 className='font-heading text-heading-md text-blue-700 font-bold tracking-heading md:text-heading-lg text-[2rem] text-center'>
                  Join the JSON Schema Slack workspace!
                </h2>
                <h2 className='font-heading text-gray-700 text-heading-md font-bold tracking-heading md:text-heading-lg text-slate-500 text-sm mt-10'>
                  Join our Slack to ask questions, get feedback on your
                  projects, and connect with +5000 practitioners and experts.
                </h2>
                <div className='mt-10 mx-auto' data-testid='HomeCard-button'>
                  <a
                    href='/slack'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                  >
                    Join Slack
                  </a>
                </div>
              </div>
            </div>
            <div className='w-full h-fit-content md:w-3/6  flex rounded-r-lg justify-end bg-cover bg-center bg-slack' />
          </div>
        </div>

        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <div className='z-40 mt-20 w-full rounded-lg border border-gray-200 bg-white shadow-3xl transition-colors delay-[150ms] hover:bg-slate-100 shadow-xl md:flex grid grid-cols-1 lg:grid-cols-2 justify-between'>
            <div className='p-4 px-8 grid items-center w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div data-testid='HomeCard-main'>
                <h2 className='text-blue-700 text-[2rem] font-heading text-heading-md font-bold tracking-heading md:text-heading-lg text-center'>
                  JSON Schema Community Meetings & Events
                </h2>
                <h2 className='text-slate-500 text-sm mt-10 font-heading text-body-lg tracking-body font-regular'>
                  We hold monthly Office Hours and weekly Open Community Working
                  Meetings. Office Hours are every first Tuesday of the month at
                  15:00 BST, and by appointment. Open Community Working Meetings
                  are every Monday at 14:00 PT.
                </h2>
                <div className='mt-10' data-testid='HomeCard-button'>
                  <a
                    href='https://github.com/orgs/json-schema-org/discussions/35'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                  >
                    Open Community Working Meetings
                  </a>
                  <br />
                  <a
                    href='https://github.com/orgs/json-schema-org/discussions/34/'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none mt-2'
                  >
                    Office Hours
                  </a>
                </div>
              </div>
            </div>
            <div className='w-fit-content h-fit-content py-3 md:w-3/6 flex rounded-r-lg justify-end'>
              <div className='mx-auto'>
                <h2 className='text-[2rem] text-center text-primary text-[2rem] font-heading text-heading-md font-bold tracking-heading md:text-heading-lg'>
                  Upcoming events
                </h2>
                {props.datesInfo.map((event: any, index: any) => (
                  <div
                    key={index}
                    className='mx-auto bg-slate-100 h-[90px] w-full md:w-[450px] rounded-lg flex gap-[10px] items-center p-2 gap-4 mt-2'
                  >
                    <div
                      className={`h-[70px]  w-[70px]  rounded-lg text-center grid items-center bg-index-${index}`}
                    >
                      <p className='text-[2rem] dark:text-black'>{event.day}</p>
                    </div>
                    <div className='h-[70px]  rounded-lg grid items-center px-2'>
                      <p className='leading-7 text-[12px] dark:text-black'>
                        <b className='text-blue-700'>{event.title}</b>
                        <br />
                        {event.time}({event.timezone})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <div className='z-40 mt-20 w-full md:h-130 rounded-lg border border-gray-200 bg-white shadow-3xl transition-colors delay-[150ms] hover:bg-slate-100 md:flex grid grid-cols-1 md:grid-cols-2 justify-between mb-10'>
            <div className='p-4 px-8 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div data-testid='HomeCard-main' className='m-auto'>
                <h2 className='font-heading text-heading-md text-blue-700 font-bold tracking-heading md:text-heading-lg text-[2rem] text-center'>
                  Welcome to
                  <br />
                  the JSON Schema Blog!
                </h2>
                <h2 className='font-heading text-gray-700 text-heading-md font-bold tracking-heading md:text-heading-lg text-slate-500 text-sm mt-10'>
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
                  </p>{' '}
                </h2>
                <div className='mt-10 mx-auto' data-testid='HomeCard-button'>
                  <a
                    href='/blog'
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                  >
                    Read blog
                  </a>
                </div>
              </div>
            </div>
            <div className='p-10 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
              <div className='w-full mb-6'>
                <Link href={`/blog/posts/${blogPosts[0].slug}`}>
                  <img
                    src={blogPosts[0].frontmatter.cover}
                    className='w-full h-[232px]  mb-4'
                  />
                  <h3 className='mb-4 font-semibold'>
                    {blogPosts[0].frontmatter.title}
                  </h3>
                  <div className='mb-4 text-[14px]'>
                    <TextTruncate
                      element='span'
                      line={4}
                      text={blogPosts[0].frontmatter.excerpt}
                    />
                  </div>
                  <div className='flex ml-2 mb-2 '>
                    <div
                      className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                      style={{
                        backgroundImage: `url(${blogPosts[0].frontmatter.authors[0].photo})`,
                      }}
                    />
                    <div className='flex flex-col ml-2'>
                      <p className='text-sm font-semibold'>
                        {blogPosts[0].frontmatter.authors[0].name}
                      </p>
                      <div className='text-slate-500 text-sm'>
                        <span>
                          {blogPosts[0].frontmatter.date} &middot;{timeToRead}{' '}
                          min min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className='mx-auto '>
                  <a
                    href={`/blog/posts/${blogPosts[0].slug}`}
                    rel='noopener noreferrer'
                    className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none mt-4'
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

communityPages.getLayout = getLayout;
