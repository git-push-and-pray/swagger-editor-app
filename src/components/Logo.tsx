import type { JSX } from 'react/jsx-runtime';

import { Link } from '@/i18n/navigation';

interface LogoProps {
  type: 'short' | 'long' | 'shortSmall';
}

const Logo = ({ type }: LogoProps): JSX.Element => {
  return (
    <Link
      href="/"
      className="focus-visible:outline-info flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span
        className={`text-text-foreground bg-foreground rounded-sm font-serif font-bold ${
          type === 'shortSmall' ? 'px-3 py-1 text-sm' : 'px-3 py-1 text-base'
        }`}
      >
        S
      </span>

      {type === 'long' && (
        <h1 className="text-text-primary font-serif text-lg font-semibold tracking-wide">
          SwaggerEditor
        </h1>
      )}
    </Link>
  );
};

export default Logo;
