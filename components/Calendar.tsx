import React from 'react'
import eventsData from './datesCalendar.json'
import { Headline3 } from '~/components/Headlines'
import 'moment-timezone'
import moment from 'moment'


export default function Calendar() {
  // const CALENDAR_URL =
  //     'https://calendar.google.com/calendar/u/0/embed?src=c_8r4g9r3etmrmt83fm2gljbatos@group.calendar.google.com';

  const sortedEvents = eventsData.sort((a, b) => (a.date.toLowerCase() < b.date.toLowerCase()) ? -1 : ((b.date.toLowerCase() > a.date.toLowerCase()) ? 1 : 0))

  return (
    <div>
      <Headline3>Upcoming Events</Headline3>
      {/* {meetingsWithDates} */}
      <ul>
        {sortedEvents.slice(0, 3).map((event, index) => (
          <li key={index}>
            <div className='flex mb-4'>
              <p className='bg-btnOrange rounded-full w-10 h-10 p-2 text-center text-white mr-2'>
                {moment(event.date).get('date')}
              </p> 
              <div>
                <p className=''>{event.title}</p>
                
                {moment(event.date).utc().format('Do MMMM YYYY, h:mm a z')}
              
              </div>
            </div>
          </li>
        ))}

      </ul>
    </div>
  )
}
