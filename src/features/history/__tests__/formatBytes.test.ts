import { describe, expect, it } from 'vitest';

import { formatBytes } from '../utils/formatBytes';

describe('Format Bytes Utility Function', () => {
  it('should format bytes correctly into B, KB, or MB', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576 * 2)).toBe('2.0 MB');
  });
});
