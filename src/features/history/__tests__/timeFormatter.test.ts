import { getFormatter } from 'next-intl/server';
import { describe, expect, it, vi } from 'vitest';

import { formatTimestamp } from '../utils/timeFormatter';

vi.mock('next-intl/server', () => ({
  getFormatter: vi.fn().mockResolvedValue({
    dateTime: (_date: Date, options: Intl.DateTimeFormatOptions) => {
      if (options.day === 'numeric') return '8';
      if (options.month === 'long') return 'July';
      if (options.year === 'numeric') return '2026';
      if (options.hour === '2-digit') return '22:45';
      return '';
    },
  }),
}));

describe('formatTimestamp Utility', () => {
  it('should correctly call getFormatter and compose the formatted date string', async () => {
    const mockDate = new Date('2026-07-08T22:45:00Z');

    const result = await formatTimestamp(mockDate, 'en');

    expect(getFormatter).toHaveBeenCalledWith({ locale: 'en' });
    expect(result).toBe('8 July 2026, 22:45');
  });

  it('should handle timestamp passed as a string representation', async () => {
    const mockTimestampStr = '1719876000000';

    const result = await formatTimestamp(mockTimestampStr, 'ru');

    expect(getFormatter).toHaveBeenCalledWith({ locale: 'ru' });
    expect(result).toBe('8 July 2026, 22:45');
  });
});
