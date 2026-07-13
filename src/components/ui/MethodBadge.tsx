import type { JSX } from 'react/jsx-runtime';

import type { HttpMethod } from '@/types/openapi';

const httpMethods = {
  GET: 'bg-accent/20 text-accentdark',
  POST: 'bg-info/20 text-infodark',
  PUT: 'bg-warning/15 text-warningdark',
  PATCH: 'bg-purple/15 text-purple',
  DELETE: 'bg-error/20 text-errordark',
  OPTIONS: 'bg-darkblue/20 text-darkblue',
  HEAD: 'bg-slate/20 text-slatedark',
  TRACE: 'bg-indigo/20 text-indigodark',
} as const;

const methodSizes = {
  m: 'text-xs',
  s: 'text-[10px]',
};

interface MethodBadgeProps {
  method: HttpMethod;
  size?: keyof typeof methodSizes;
}

const MethodBadge = ({ method, size = 's' }: MethodBadgeProps): JSX.Element => {
  const badgeClasses = [
    httpMethods[method],
    methodSizes[size],
    'rounded px-2 py-0.5 font-sans font-bold uppercase w-fit',
  ]
    .filter(Boolean)
    .join(' ');
  return <div className={badgeClasses}>{method}</div>;
};

export default MethodBadge;
