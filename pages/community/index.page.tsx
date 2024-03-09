import React from 'react';
import { getLayout } from '~/components/SiteLayout';
import { SectionContext } from '~/context';
import orbitData from './config/orbitData.json';
import Header from './Header';
import Coloumn from './column/Coloumn';
import Card from './card/Card';
import Event from './event/Event';
import Heading from './typography/Heading';
import BlogCard from './card/BlogCard';

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
        <div className='md:hidden mt-[100px]'>
          <Header />
        </div>
        <div className='overflow-hidden orbits'>
          <div className='orbit-container' data-testid='orbit-div'>
            <div id='first-orbit' className='orbit' data-testid='Hero-first'>
              {orbitData[0].map((orbit) => (
                <div key={orbit.id} className={orbit.id}>
                  <img
                    src={orbit.img}
                    alt={orbit.alt}
                    className='orbit-img'
                    data-testid='Hero-firstimg'
                  />
                </div>
              ))}
              <div className='w-full absolute h-full flex justify-center z-40 top-12'>
                <Header />
              </div>
            </div>
            <div id='second-orbit' className='orbit' data-testid='Hero-second'>
              {orbitData[1].map((orbit) => (
                <div key={orbit.id} className={orbit.id}>
                  <img
                    src={orbit.img}
                    alt={orbit.alt}
                    data-testid='Hero-secondimg'
                  />
                </div>
              ))}
            </div>
            <div id='third-orbit' className='orbit' data-testid='Hero-third'>
              {orbitData[2].map((orbit) => (
                <div key={orbit.id} className={orbit.id}>
                  <img
                    src={orbit.img}
                    alt={orbit.alt}
                    data-testid='Hero-thirdimg'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className='mt-10 md:mt-0'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-9/12 sm:w-8/12 md:w-10/12 lg:w-10/12 xl:w-9/12 2xl:8/12 m-auto'>
            <Coloumn
              testId='1'
              href='https://github.com/orgs/json-schema-org/discussions/427'
              className='bg-sky-400'
              emoji='🚀'
              h1='Roadmap'
              p='We’re looking forward to working with you. Welcome aboard! 🚀'
            />
            <Coloumn
              testId='2'
              href='https://github.com/json-schema-org/.github/blob/main/CONTRIBUTING.md'
              className='bg-sky-400'
              emoji='🚀'
              h1='Contributing'
              p='We’re looking forward to working with you. Welcome aboard! 🚀'
            />
          </div>
        </section>
        {/* <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'> */}
        <Card
          headline='Thanking our JSON Schema Ambassadors'
          title='Ambassador Programs'
          description="Launch OSS community programs that your community is proud to
            participate in. Let's build thriving OSS communities together!"
          btnText='Become an ambassador'
          link='/community/ambassadors'
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
        {/* </div> */}

        {/* <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'> */}
        <Event
          // headline='JSON Schema Community Meetings & Events'
          title='JSON Schema Community Meetings & Events'
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
        {/* </div> */}

        {/* <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'> */}
        <div className='z-40 mt-20 bg-white w-full md:h-130 rounded-lg shadow-xl md:flex grid grid-cols-2 justify-between'>
          <div className='p-10 flex justify-between w-full md:w-2/5 h-auto flex-col text-center md:text-left'>
            <div data-testid='HomeCard-main'>
              <Heading
                level='h2'
                typeStyle='heading-md'
                textColor='text-purple-300'
                id=''
                className=''
              >
                Upcoming events
              </Heading>
            </div>
            <div data-testid='HomeCard-title'>
              <div className='mt-4'>
                <ul>
                  {props.datesInfo.map((event: any, index: any) => (
                    <li key={index}>
                      <div className='flex mb-4'>
                        <p className='bg-btnOrange rounded-full w-10 h-10 p-2 text-center text-white mr-2'>
                          {event.day}
                        </p>
                        <div className='text-sm'>
                          <p>{event.title}</p>
                          <p>
                            <b>{event.time}</b> ({event.timezone})
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-10' data-testid='HomeCard-button'>
                <a
                  href='https://calendar.google.com/calendar/u/0/embed?src=c_8r4g9r3etmrmt83fm2gljbatos@group.calendar.google.com'
                  className='w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] text-center flex items-center justify-center'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Calendar
                </a>
              </div>
            </div>
          </div>
          <div
            className={`w-full h-fit-content md:w-3/6 flex rounded-r-lg justify-end bg-cover bg-center ${props.className}`}
          ></div>
        </div>
        {/* </div> */}

        {/* <div className='m-auto w-12/12 md:w-11/12 lg:w-10/12 xl:w-10/12'> */}
        <div className='z-40 mt-20 bg-white w-full md:h-130 rounded-lg shadow-xl md:flex grid grid-cols-2 justify-between'>
          <div className='p-10 flex justify-between w-full md:w-2/5 h-auto flex-col text-center md:text-left'>
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
        {/* </div> */}

        {/* BlogPost Data */}
        {/* <div className='w-full mb-6'>
              <Link href={`/blog/posts/${blogPosts[0].slug}`}>
                <h3 className='mb-5 font-semibold pt-1'>
                  The JSON Schema Blog
                </h3>
                <img
                  src={blogPosts[0].frontmatter.cover}
                  className='w-full h-[232px]  mb-4'
                />
                <h3 className='mb-4 font-semibold'>
                  {' '}
                  {blogPosts[0].frontmatter.title}
                </h3>
                <div className='mb-4'>
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
                        {blogPosts[0].frontmatter.date} &middot; {timeToRead}{' '}
                        min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              <div>
                <Link
                  href={`/blog/posts/${blogPosts[0].slug}`}
                  className='w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] text-center semi-bold flex items-center justify-center'
                >
                  Read more{' '}
                </Link>
              </div>
            </div> */}

        {/* <div>
          <div>
            <div>
              <Headline4>Upcoming events</Headline4>
              <div>
                <ul>
                  {props.datesInfo.map((event: any, index: any) => (
                    <li key={index}>
                      <div className='flex mb-4'>
                        <p className='bg-btnOrange rounded-full w-10 h-10 p-2 text-center text-white mr-2'>
                          {event.day}
                        </p>
                        <div className='text-sm'>
                          <p>{event.title}</p>
                          <p>
                            <b>{event.time}</b> ({event.timezone})
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <a
              href='https://calendar.google.com/calendar/u/0/embed?src=c_8r4g9r3etmrmt83fm2gljbatos@group.calendar.google.com'
              className='w-full lg:w-1/2 rounded border-2 bg-primary text-white  h-[40px] text-center flex items-center justify-center'
              target='_blank'
              rel='noopener noreferrer'
            >
              View Calendar
            </a>
          </div>
        </div> */}
      </div>
    </SectionContext.Provider>
  );
}

communityPages.getLayout = getLayout;

// function ImplementationTable({
//   implementationsByLanguage,
//   prefix,
// }: {
//   implementationsByLanguage: any;
//   prefix: string;
// }) {
//   const router = useRouter();
//   return (
//     <>
//       <div className='flex flex-row flex-wrap grid-cols-7 grid'>
//         {implementationsByLanguage.map(
//           (implementationByLanguage: any, index: number) => {
//             const slug =
//               prefix +
//               slugify(implementationByLanguage.name, {
//                 lower: true,
//                 trim: true,
//               });
//             const isActive = router.query.language === slug;
//             return (
//               <a
//                 key={index}
//                 href={`#${slug}`}
//                 className={classnames(
//                   'block text-center text-white rounded p-2 cursor-pointer flex-1 m-1',
//                   {
//                     'bg-blue-800': isActive,
//                     'bg-blue-500 hover:bg-blue-600': !isActive,
//                   },
//                 )}
//               >
//                 {implementationByLanguage.name}
//               </a>
//             );
//           },
//         )}
//       </div>
//       <div className='bg-blue-50 rounded-xl py-2 p-6 mt-4 pb-6 pt-0.5'>
//         <table>
//           <thead>
//             <tr>
//               <td />
//               <td className='pt-6 pl-5 text-sm text-slate-500 hidden sm:table-cell'>
//                 About
//               </td>
//               <td className='pt-6 pl-5 text-sm text-slate-500'>Drafts</td>
//               <td className='pt-6 pl-5 text-sm text-slate-500'>License</td>
//             </tr>
//           </thead>
//           <tbody>
//             {implementationsByLanguage.map(
//               (implementationByLanguage: any, index: number) => {
//                 const slug =
//                   prefix +
//                   slugify(implementationByLanguage.name, {
//                     lower: true,
//                     trim: true,
//                   });
//                 const isActive = router.query.language === slug;
//                 if (router.query.language && !isActive) return null;

//                 // return (
//                 //   <React.Fragment key={index}>
//                 //     <tr>
//                 //       <td colSpan={3}>
//                 //         <Headline3 attributes={{ slug }}>
//                 //           {implementationByLanguage.name}
//                 //         </Headline3>
//                 //       </td>
//                 //     </tr>
//                 //     {implementationByLanguage.implementations.map(
//                 //       (implementation: any, index: number) => {
//                 //         let mixedNotes = '';
//                 //         if (implementation.notes) {
//                 //           mixedNotes = implementation.notes;
//                 //         }
//                 //         if (implementation.compliance) {
//                 //           if (implementation.notes) {
//                 //             mixedNotes += '<br/><em>Compliance:</em>';
//                 //           } else {
//                 //             mixedNotes = '<em>Compliance:</em>';
//                 //           }
//                 //           if (implementation.compliance.config.docs) {
//                 //             mixedNotes +=
//                 //               ' This implementation <a href='' +
//                 //               implementation.compliance.config.docs +
//                 //               ''>documents</a> that you must ';
//                 //           }
//                 //           if (implementation.compliance.config.instructions) {
//                 //             mixedNotes +=
//                 //               '<strong>' +
//                 //               implementation.compliance.config.instructions +
//                 //               '</strong> to produce specification-compliant behavior.';
//                 //           }
//                 //         }
//                 //         const allDrafts = [
//                 //           ...(implementation['date-draft'] || []),
//                 //           ...(implementation['draft'] || []),
//                 //         ];
//                 //         return (
//                 //           <tr
//                 //             key={index}
//                 //             className='pl-4 list-disc list-inside pl-2 separation-line'
//                 //           >
//                 //             <td className=''>
//                 //               <a
//                 //                 className='text-blue-500'
//                 //                 href={implementation.url}
//                 //               >
//                 //                 {implementation.name}
//                 //               </a>
//                 //             </td>
//                 //             <td className='pl-6 hidden sm:table-cell'>
//                 //               <StyledMarkdown markdown={mixedNotes} />
//                 //             </td>
//                 //             <td className='pl-6 pb-2 pt-2'>
//                 //               {allDrafts
//                 //                 ?.sort((a, b) =>
//                 //                   DRAFT_ORDER.indexOf(a) <
//                 //                     DRAFT_ORDER.indexOf(b)
//                 //                     ? -1
//                 //                     : 1,
//                 //                 )
//                 //                 ?.map((draft: string | number) => (
//                 //                   <span
//                 //                     className='bg-blue-400 inline-block mr-1 mb-1 text-white rounded px-1'
//                 //                     key={draft}
//                 //                   >
//                 //                     {typeof draft === 'number'
//                 //                       ? zeroFill(2, draft)
//                 //                       : draft}
//                 //                   </span>
//                 //                 ))}
//                 //             </td>
//                 //             <td className='pl-6'>{implementation.license}</td>
//                 //           </tr>
//                 //         );
//                 //       },
//                 //     )}
//                 //   </React.Fragment>
//                 // );
//               },
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }
