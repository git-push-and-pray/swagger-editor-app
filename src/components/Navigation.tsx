'use client';

import type { JSX } from 'react';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/features/auth/hooks/useAuth';

import Button from './ui/Button';
import LinkComponent from './ui/Link';

interface MenuItemClickProps {
  onItemClick?: () => void;
}

export const Navigation = ({ onItemClick }: MenuItemClickProps): JSX.Element => {
  const t = useTranslations('Navigation');
  const { isAuth } = useAuth();
  return (
    <nav className="flex flex-col items-center gap-1 md:flex-row md:gap-0.5">
      <LinkComponent
        href="/about"
        name={t('aboutNav')}
        linkVersion="nav"
        size="sm"
        onClick={onItemClick}
      />
      {isAuth && (
        <LinkComponent
          href="/history"
          name={t('historyNav')}
          linkVersion="nav"
          size="sm"
          onClick={onItemClick}
        />
      )}
    </nav>
  );
};

export const UserActions = ({ onItemClick }: MenuItemClickProps): JSX.Element => {
  const t = useTranslations('Navigation');
  const { isAuth, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onItemClick?.();
  };

  if (isAuth)
    return (
      <Button
        onClick={handleSignOut}
        icon="sign-out"
        hideTextOnMobile={false}
        name={t('signOut')}
        btnVersion="ghostRegular"
        size="sm"
      />
    );
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row">
      <LinkComponent
        href="/signin"
        name={t('signIn')}
        linkVersion="nav"
        size="sm"
        onClick={onItemClick}
      />
      <LinkComponent
        href="/signup"
        name={t('signUp')}
        linkVersion="primary"
        size="sm"
        onClick={onItemClick}
      />
    </div>
  );
};
