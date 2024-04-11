import React from 'react';
import { getLayout } from '~/components/SiteLayout';
import { SectionContext } from '~/context';
import orbitData from './config/orbitData.json';
import Header from './Header';
import Coloumn from './Coloumn';
import Card from './Card';
import Event from './Event';
import Heading from './Heading';
import BlogCard from './BlogCard';

// import { getLayout } from '../components/SiteLayout';
// import { DocSearch } from '@docsearch/react';
import fs from 'fs';
import matter from 'gray-matter';
const PATH = 'pages/blog/posts';
import readingTime from 'reading-time';
// import Link from 'next/link';
// import TextTruncate from 'react-text-truncate';
import { GetStaticProps } from 'next';

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

// const Event = (props: any) => {
//     // const blogPosts = props.blogPosts;
//     // const timeToRead = Math.ceil(readingTime(blogPosts[0].content).minutes);

//     return (

//     )
// }

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
            <Header />
          </div>
          <div className='grid justify-center items-center gap-y-[10px]'>
            <div className='grid  justify-center mt-[50px] gap-y-[10px]'>
              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[0].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full border-black'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[1].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>
              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[2].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[3].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>
              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[4].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[5].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>
              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[6].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>

              <div className='flex justify-start gap-x-[10px]'>
                {orbitData[7].map((orbit, index) => (
                  <>
                    <img
                      key={index} // Ensure each element has a unique key
                      src={orbit.img}
                      alt={orbit.alt}
                      className='orbit-img w-[35px] sm:w-[40px] md:w-[45px] lg:w-[50px] h-[35px] sm:h-[40px] md:h-[45px] lg:h-[50px] rounded-full'
                      // data-testid={`Hero-img-${index}`} // Ensure each img has a unique data-testid
                    />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
        <section className='mt-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4  w-8/12 sm:w-8/12 md:w-10/12 lg:w-[70%] xl:w-[70%] m-auto'>
            <Coloumn
              testId='1'
              href='https://github.com/orgs/json-schema-org/discussions/427'
              className='bg-sky-400 max-w-md'
              emoji='🚴🏾'
              h1='Roadmap'
              p='Explore our exciting plans and upcoming milestones. 🚀'
            />
            <Coloumn
              testId='2'
              href='https://github.com/json-schema-org/.github/blob/main/CONTRIBUTING.md'
              className='bg-sky-400 max-w-md'
              emoji='👨🏻‍💻'
              h1='Contributing'
              p='We’re looking forward to working with you. Welcome aboard! 🚀'
            />
          </div>
        </section>
        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <Card
            headline='Thanking our JSON Schema Ambassadors'
            title='Ambassador Programs'
            description="Launch OSS community programs that your community is proud to
            participate in. Let's build thriving OSS communities together!"
            btnText='Become an ambassador'
            href='/community/ambassadors'
            className='bg-ambassador'
          />
          {/* </div> */}

          {/* <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'> */}
          <Card
            headline='Join the JSON Schema Slack Workspace!'
            title='Slack Community'
            description='Join our Slack to ask questions, get feedback on your
             projects, and connect with +5000 practitioners and experts.'
            btnText='Join Slack'
            href='https://json-schema.slack.com/ssb/redirect'
            className='bg-slack'
          />
        </div>

        <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'>
          <Event
            headline='JSON Schema Community Meetings & Events'
            title='Join Meetings'
            description='We hold monthly Office Hours and weekly Open Community Working
            Meetings. Office Hours are every first Tuesday of the month at
            15:00 BST, and by appointment. Open Community Working Meetings
            are every Monday at 14:00 PT.'
            btnText='Open Community Working Meetings'
            href='https://github.com/orgs/json-schema-org/discussions/35'
            btn2Class='mt-2'
            btnText2='Office Hours'
            href2='https://github.com/orgs/json-schema-org/discussions/34/'
            className='bg-meeting'
          />
        </div>
        <div className='mx-auto mt-20'>
          <Heading
            level='h2'
            typeStyle='heading-lg'
            textColor='text-primary text-[2rem]'
            className='text-[2rem] text-center mb-8'
          >
            Upcoming events
          </Heading>
          {props.datesInfo.map((event: any, index: any) => (
            <div
              key={index}
              className='mx-auto bg-slate-100 h-[90px]  w-[550px] rounded-lg flex gap-[10px] items-center p-2 gap-4 mt-2'
            >
              <div
                className={`h-[70px]  w-[70px]  rounded-lg text-center grid items-center bg-index-${index}`}
              >
                <p className='text-[2rem]'>{event.day}</p>
              </div>
              <div className='h-[70px]  rounded-lg grid items-center px-2'>
                <p className='leading-7'>
                  <b className='text-blue-700'>{event.title}</b>
                  <br />
                  {event.time}({event.timezone})
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className='z-40 mt-20 bg-white w-full md:h-130 rounded-lg shadow-xl md:flex grid grid-cols-1 md:grid-cols-2 justify-between mb-10'>
          <div className='p-10 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
            <BlogCard
              href={`/blog/posts/${blogPosts[0].slug}`}
              src={blogPosts[0].frontmatter.cover}
              h3_1={blogPosts[0].frontmatter.title}
              text={blogPosts[0].frontmatter.excerpt}
              url={blogPosts[0].frontmatter.authors[0].photo}
              author={blogPosts[0].frontmatter.authors[0].name}
              spanPart1={blogPosts[0].frontmatter.date}
              spanPart2={timeToRead}
            />
          </div>
          <div className='w-full h-fit-content md:w-3/6 flex rounded-r-lg justify-end bg-cover bg-center bg-blog'></div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

communityPages.getLayout = getLayout;
