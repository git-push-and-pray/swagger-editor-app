'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';

import { Navigation, UserActions } from '../Navigation';
import SelectLanguage from '../SelectLanguage';
import Icon from '../ui/Icon';
import Logo from '../ui/Logo';

const Header = (): JSX.Element => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled((prevScrolled) => {
        if (!prevScrolled && currentScroll > 50) return true;
        if (prevScrolled && currentScroll <= 15) return false;
        return prevScrolled;
      });
    };
    window.addEventListener('scroll', onScroll);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={[
        'border-border bg-surface sticky top-0 z-50 border-b-2 px-5 transition-all duration-300',
        scrolled ? 'py-2 shadow-md backdrop-blur-md' : 'py-4',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-360 justify-between 2xl:max-w-450">
        <Logo type="long" />

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <Icon name="burger" size="l" />
            </SheetTrigger>
            <SheetContent>
              <Navigation onItemClick={closeMenu} />
              <div className="bg-border my-1 h-0.5 w-[80%]" />
              <UserActions onItemClick={closeMenu} />
              <div className="bg-border my-1 h-0.5 w-[80%]" />
              <SelectLanguage />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <Navigation />
          <div className="bg-border h-full w-0.5" />
          <SelectLanguage />
          <div className="bg-border h-full w-0.5" />
          <UserActions />
        </div>
      </div>
    </header>
  );
};

export default Header;
