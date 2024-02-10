import React from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';

interface UserTimezoneDateProps {
  date: Date | string;
}

// date must be UTC timestamp
export const UserTimezoneDate: React.FC<UserTimezoneDateProps> = ({ date }) => {
  const getUserTimeZone = (): string => {
    // check if Intl api is available for the user's local browser
    if (typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else {
    // Fallback to a default time zone if Intl API is not supported
      console.log('Intl API is not supported');
      return 'UTC';
    }
  };
  const userTimeZone = getUserTimeZone();
  const zonedDate = typeof date === 'string' ? new Date(date) : date;

  return (
    <p>{ format(utcToZonedTime(zonedDate, userTimeZone), 'MMM d, yyyy h:mma') }</p>
  );
};