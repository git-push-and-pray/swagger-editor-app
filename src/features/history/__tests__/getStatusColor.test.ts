import { describe, expect, it } from 'vitest';

import { getStatusClasses } from '../utils/getStatusColor';

describe('getStatusColor Utility', () => {
  it('should return accent classes for 2xx status codes', () => {
    const result = getStatusClasses(200);
    expect(result).toEqual({
      text: 'text-accent',
      dot: 'bg-accent',
    });
  });

  it('should return warning classes for 4xx status codes', () => {
    const result = getStatusClasses(404);
    expect(result).toEqual({
      text: 'text-warning',
      dot: 'bg-warning',
    });
  });

  it('should return error classes for 5xx status codes', () => {
    const result = getStatusClasses(500);
    expect(result).toEqual({
      text: 'text-error',
      dot: 'bg-error',
    });
  });

  it('should return error classes for 3xx status codes as fallback', () => {
    const result = getStatusClasses(302);
    expect(result).toEqual({
      text: 'text-error',
      dot: 'bg-error',
    });
  });
});
