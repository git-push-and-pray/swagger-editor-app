import type { HttpMethod } from '@/types/httpMethods';

export interface RequestHistory {
  id: string;
  userId: string;
  timestamp: string | Date;
  endpoint: string;
  method: HttpMethod;
  status: number;
  duration: number;
  requestSize: number;
  responseSize: number;
  url: string;
  errorDetails?: string;
}
