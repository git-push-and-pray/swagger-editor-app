import { describe, expect, it } from 'vitest';

import { getStatusText } from '../utils/getStatusText';

describe('Get Status Text Utility Function', () => {
  it('should return correct HTTP status text or empty string if unknown', () => {
    expect(getStatusText(404)).toBe('Not Found');
    expect(getStatusText(500)).toBe('Internal Server Error');
    expect(getStatusText(999)).toBe('');
  });
});
