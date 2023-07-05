import React from 'react'
import eventsData from './datesCalendar.json'
import dayjs from 'dayjs'

import localizedFormat from 'dayjs/plugin/localizedFormat'

export default function Calendar() {
  // const CALENDAR_URL =
  //     'https://calendar.google.com/calendar/u/0/embed?src=c_8r4g9r3etmrmt83fm2gljbatos@group.calendar.google.com';

  dayjs.extend(localizedFormat)

  const sortedEvents = [...eventsData].sort()
  console.log('sorted', sortedEvents)

  const currentMonth = dayjs().month() + 1
  const monthString = currentMonth.toString()


  const currentEvents = sortedEvents.filter((item) => dayjs(item.date).format('MM') >= monthString)
  console.log('new', currentEvents)

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
