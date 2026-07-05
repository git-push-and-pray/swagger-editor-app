import type { JSX } from 'react/jsx-runtime';

import Logo from '@/components/ui/Logo';

interface AuthFormLayoutProps {
  title: string;
  desc: string;
  footerText: React.ReactNode;
  children: React.ReactNode;
}

const AuthFormLayout = ({
  title,
  desc,
  footerText,
  children,
}: AuthFormLayoutProps): JSX.Element => {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <Logo type="short" />
      <div className="text-center">
        <h2 className="text-text-primary font-serif text-2xl font-semibold">{title}</h2>
        <p className="text-text-secondary mt-1 max-w-80 font-sans text-sm font-normal">{desc}</p>
      </div>

      {children}

      <div className="text-text-secondary text-center font-sans text-sm font-normal">
        {footerText}
      </div>
    </div>
  );
};

export default AuthFormLayout;
