import type { JSX } from 'react';

import { Navigation } from '../Navigation';
import Logo from '../ui/Logo';

const Footer = (): JSX.Element => {
  return (
    <footer className="border-border bg-surface border-t-2 px-5 py-2">
      <div className="mx-auto flex max-w-360 flex-col-reverse items-center justify-between gap-2 sm:flex-row 2xl:max-w-450">
        <div className="ml-1 flex items-center gap-2 text-sm">
          <Logo type="shortSmall" />
          <span>© 2026 SwaggerEditor</span>
        </div>
        <Navigation />
      </div>
    </footer>
  );
};

export default Footer;
