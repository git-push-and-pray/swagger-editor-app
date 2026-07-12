import { describe, expect, it } from 'vitest';

import { type TFunction } from '@/types/translation';

import { getNetworkError } from '../utils/getNetworkError';

const mockT = ((key: string, ..._args: unknown[]) => key) as unknown as TFunction;

describe('getNetworkError Utility', () => {
  it('should return network error key if error message contains "fetch"', () => {
    const error = new Error('Failed to fetch data from server');
    const result = getNetworkError(error, mockT);
    expect(result).toBe('error.network');
  });

  it('should return network error key if error message contains "network"', () => {
    const error = new Error('A network error occurred');
    const result = getNetworkError(error, mockT);
    expect(result).toBe('error.network');
  });

  it('should return custom error message if it is not a network issue', () => {
    const error = new Error('Invalid validation parameters');
    const result = getNetworkError(error, mockT);
    expect(result).toBe('Invalid validation parameters');
  });

  it('should handle non-Error objects correctly by converting them to string', () => {
    const primitiveError = 'Some string error';
    const result = getNetworkError(primitiveError, mockT);
    expect(result).toBe('Some string error');
  });

  it('should fallback to error.unknown if error message is empty', () => {
    const error = new Error('');
    const result = getNetworkError(error, mockT);
    expect(result).toBe('error.unknown');
  });
});
