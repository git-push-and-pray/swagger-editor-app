import type { HttpMethod } from '@/types/httpMethods';

export interface HistoryEntry {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  timestamp: string;
  duration: number;
  reqSize: number;
  resSize: number;
  error: string | null;
}
