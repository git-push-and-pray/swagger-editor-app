import { getFormatter } from 'next-intl/server';

export async function formatTimestamp(timestamp: string | Date, locale: string): Promise<string> {
  const format = await getFormatter({ locale });
  const date = new Date(timestamp);

  const day = format.dateTime(date, { day: 'numeric' });
  const month = format.dateTime(date, { month: 'long' });
  const year = format.dateTime(date, { year: 'numeric' });
  const time = format.dateTime(date, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${day} ${month} ${year}, ${time}`;
}
