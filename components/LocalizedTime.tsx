import React, { useEffect, useState } from 'react';

interface LocalizedTimeProps {
  utcTime: string;
  utcDate: string;
}

const LocalizedTime: React.FC<LocalizedTimeProps> = ({ utcTime, utcDate }) => {
  const [localized, setLocalized] = useState<string | null>(null);

  useEffect(() => {
    try {
      const dateStr = utcDate.replace(' ', 'T') + 'Z';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTimeZone === 'UTC' || userTimeZone === 'Etc/UTC') return;

      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      };

      // Check if the date changed locally (e.g., event is 11 PM UTC, but 4 AM next day local)
      if (new Date(dateStr).getUTCDate() !== date.getDate()) {
        options.month = 'short';
        options.day = 'numeric';
      }

      const formatted = new Intl.DateTimeFormat(undefined, options).format(
        date,
      );
      setLocalized(formatted);
    } catch (err) {
      console.error('Error localizing time:', err);
    }
  }, [utcDate]);

  return (
    <>
      {utcTime} UTC
      {localized && (
        <span className='text-blue-600 dark:text-blue-400 font-semibold ml-1'>
          ({localized})
        </span>
      )}
    </>
  );
};

export default LocalizedTime;
