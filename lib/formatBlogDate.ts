// Frontmatter dates like "2023-05-08" are parsed as midnight UTC.
// Formatting them in the visitor's local timezone shifts the day
// west of UTC, so always format the calendar date in UTC.
export default function formatBlogDate(
  date: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return parseCalendarDate(date).toLocaleDateString('en-us', {
    ...options,
    timeZone: 'UTC',
  });
}

function parseCalendarDate(date: string): Date {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date.trim());
  if (!match) {
    return new Date(date);
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  return new Date(Date.UTC(year, month, day));
}
