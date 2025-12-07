import moment from 'moment-timezone';
import type { CalendarResponse, VEvent } from 'node-ical';

export async function fetchRemoteICalFile(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching iCal file:', error);
    return null;
  }
}

function isVEvent(component: CalendarResponse[string]): component is VEvent {
  return component.type === 'VEVENT';
}

export interface CalendarEventInfo {
  title: string | undefined;
  time: string;
  day: string;
  timezone: string;
  parsedStartDate: string;
}

export function printEventsForNextWeeks(
  icalData: CalendarResponse,
): CalendarEventInfo[] {
  const arrayDates: CalendarEventInfo[] = [];
  if (!icalData) {
    console.error('iCal data is empty or invalid.');
    return [];
  }

  // Calculate the range of dates for the next 12 weeks from today
  const today = moment().startOf('day');
  const nextTwelveWeeksEnd = moment().add(12, 'weeks').endOf('day');

  // Loop through the events in the iCal data
  for (const k in icalData) {
    const component = icalData[k];

    if (isVEvent(component)) {
      const event = component;
      const title = event.summary;

      const timezoneL = moment.tz.guess(); // Default to UTC if timezone information is not provided

      const eventStart = event.start;
      if (!eventStart) continue;

      const startDate = moment.tz(eventStart, timezoneL);

      // Complicated case - if an RRULE exists, handle multiple recurrences of the event.
      if (event.rrule !== undefined) {
        const dates = event.rrule.between(
          today.toDate(),
          nextTwelveWeeksEnd.toDate(),
          true,
        );

        // Loop through the set of date entries to see which recurrences should be printed.
        for (const date of dates) {
          const startDate = moment.tz(date, timezoneL);
          const eventtimezone = eventStart.tz ?? 'UTC';
          const owntimezone = moment.tz.guess();
          const eventOffset = moment.tz(eventtimezone).utcOffset();
          const localOffset = moment.tz(owntimezone).utcOffset();
          const offsetDifference = localOffset - eventOffset;

          // Check if the event falls within the next 4 weeks from today
          if (startDate.isBetween(today, nextTwelveWeeksEnd, undefined, '[]')) {
            const dateTimezone = moment.tz.zone(eventtimezone);
            let offset;
            if (dateTimezone && offsetDifference)
              offset =
                offsetDifference - dateTimezone.utcOffset(date.getTime());

            const newDate = moment(date).subtract(offset, 'minutes').toDate();

            const start = moment(newDate);
            const utcDate = start.utc();

            const time = utcDate.format('MMMM Do YYYY, HH:mm');
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
        if (startDate.isBetween(today, nextTwelveWeeksEnd, undefined, '[]')) {
          const utcDate = startDate.utc();

          const time = utcDate.format('MMMM Do YYYY, HH:mm');
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
    }
  }

  arrayDates.sort(
    (x, y) =>
      new Date(x.parsedStartDate).getTime() -
      new Date(y.parsedStartDate).getTime(),
  );

  return arrayDates;
}
