import type { HistoryEntry } from '../../types/historyEntry';

export const mockHistoryData: HistoryEntry[] = [
  {
    id: 'req_1',
    method: 'GET',
    url: '/api/v1/users',
    status: 200,
    timestamp: new Date().toISOString(),
    duration: 124,
    reqSize: 145,
    resSize: 2048,
    error: null,
  },
  {
    id: 'req_2',
    method: 'POST',
    url: '/api/v1/users',
    status: 400,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    duration: 86,
    reqSize: 256,
    resSize: 128,
    error: 'Validation failed on the server.',
  },
  {
    id: 'req_3',
    method: 'DELETE',
    url: '/api/v1/products/42',
    status: 404,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    duration: 45,
    reqSize: 112,
    resSize: 84,
    error: null,
  },
];
