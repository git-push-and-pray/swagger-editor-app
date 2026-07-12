import { formatBytes } from '../utils/formatBytes';

export const ANALYTICS_LAYOUT = [
  {
    key: 'status',
    icon: 'status-code',
    title: 'data.status',
    formatter: null,
  },
  {
    key: 'duration',
    icon: 'duration',
    title: 'data.duration',
    formatter: (value: number) => `${value} ms`,
  },
  {
    key: 'requestSize',
    icon: 'upload',
    title: 'data.reqSize',
    formatter: formatBytes,
  },
  {
    key: 'responseSize',
    icon: 'download',
    title: 'data.resSize',
    formatter: formatBytes,
  },
] as const;
