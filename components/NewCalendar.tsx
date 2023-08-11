const axios = require('axios');
const ical = require('node-ical');
const moment = require('moment');

// Function to fetch the remote iCal file
async function fetchRemoteICalFile(url: string) {
  try {
    const response = await axios.get(url, {method: 'no-cors'});
    return response.data;
  } catch (error) {
    console.error('Error fetching iCal file:', error);
    return null;
  }
}

// Function to filter and print events for the next 4 weeks from today
function printEventsForNextFourWeeks(icalData: { [x: string]: any; }) {
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
      let startDate = moment(event.start);
      let endDate = moment(event.end);
      let description = event.description;

      // Calculate the duration of the event for use with recurring events.
      const duration = endDate.diff(startDate);

      // Get the timezone of the event
      const timezone = event.tz || 'UTC'; // Default to UTC if timezone information is not provided

      // Complicated case - if an RRULE exists, handle multiple recurrences of the event.
      if (event.rrule !== undefined) {
        // For recurring events, get the set of event start dates that fall within the range
        // of dates we're looking for.
        const dates = event.rrule.between(
          today.toDate(),
          nextFourWeeksEnd.toDate(),
          true,
          function (date: any, i: any) {
            return true;
          }
        );

        // Loop through the set of date entries to see which recurrences should be printed.
        for (const date of dates) {
          startDate = moment(date);
          endDate = moment(date).add(duration);

          // Check if the event falls within the next 4 weeks from today
          if (startDate.isBetween(today, nextFourWeeksEnd, undefined, '[]')) {
            console.log('title:' + title);
            console.log('description:' + description);
            console.log('startDate:' + startDate.format('MMMM Do YYYY, h:mm:ss a'));
            console.log('endDate:' + endDate.format('MMMM Do YYYY, h:mm:ss a'));
            console.log('timezone:' + timezone);
            console.log('duration:' + moment.duration(duration).humanize());
            console.log();
          }
        }
      } else {
        // Simple case - no recurrences, just print out the calendar event.
        if (startDate.isBetween(today, nextFourWeeksEnd, undefined, '[]')) {
          console.log('title:' + title);
          console.log('description:' + description);
          console.log('startDate:' + startDate.format('MMMM Do YYYY, h:mm:ss a'));
          console.log('endDate:' + endDate.format('MMMM Do YYYY, h:mm:ss a'));
          console.log('timezone:' + timezone);
          console.log('duration:' + moment.duration(duration).humanize());
          console.log();
        }
      }
    }
  }
}


// Example usage:
const remoteICalUrl = 'https://calendar.google.com/calendar/ical/c_8r4g9r3etmrmt83fm2gljbatos%40group.calendar.google.com/public/basic.ics'; // Replace with the actual URL
fetchRemoteICalFile(remoteICalUrl)
.then((icalData) => printEventsForNextFourWeeks(ical.parseICS(icalData)))
.catch((error) => console.error('Error:', error));
