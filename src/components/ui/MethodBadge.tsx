import type { JSX } from 'react/jsx-runtime';

const httpMethods = {
  get: 'bg-accent/20 text-accentdark',
  post: 'bg-info/20 text-infodark',
  put: 'bg-warning/15 text-warningdark',
  patch: 'bg-purple/15 text-purple',
  delete: 'bg-error/20 text-errordark',
  options: 'bg-darkblue/20 text-darkblue',
  head: 'bg-slate/20 text-slatedark',
  trace: 'bg-indigo/20 text-indigodark',
};

const methodSizes = {
  m: 'text-xs',
  s: 'text-[10px]',
};

interface MethodBadgeProps {
  method: keyof typeof httpMethods;
  size?: keyof typeof methodSizes;
}

const MethodBadge = ({ method, size = 's' }: MethodBadgeProps): JSX.Element => {
  const badgeClasses = [
    httpMethods[method],
    methodSizes[size],
    'rounded px-2 py-0.5 font-sans font-bold uppercase',
  ]
    .filter(Boolean)
    .join(' ');
  return <div className={badgeClasses}>{method}</div>;
};

export default MethodBadge;
