import React from 'react'
import eventsData from './datesCalendar.json'
import dayjs from 'dayjs'

import localizedFormat from 'dayjs/plugin/localizedFormat'

export default function Calendar() {
  // const CALENDAR_URL =
  //     'https://calendar.google.com/calendar/u/0/embed?src=c_8r4g9r3etmrmt83fm2gljbatos@group.calendar.google.com';

  const sortedEvents = eventsData.sort((a, b) => (a.date.toLowerCase() < b.date.toLowerCase()) ? -1 : ((b.date.toLowerCase() > a.date.toLowerCase()) ? 1 : 0))
  dayjs.extend(localizedFormat)
  return (
    <div>
      <ul>
        {sortedEvents.slice(0, 3).map((event, index) => (
          <li key={index}>
            <div className='flex mb-4'>
              <p className='bg-btnOrange rounded-full w-10 h-10 p-2 text-center text-white mr-2'>
                {dayjs(event.date).format('D')}
              </p>
              <div>
                <p className=''>{event.title}</p>
                {dayjs(event.date).format('LLL')}

              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
