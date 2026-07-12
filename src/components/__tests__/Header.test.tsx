import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Header from '../layout/Header';
import { Navigation, UserActions } from '../Navigation';
import SelectLanguage from '../SelectLanguage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

const mockReplace = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/about',
  useRouter: () => ({
    replace: mockReplace,
  }),
  Link: ({
    children,
    href,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'ru', 'be', 'uk'],
  },
}));

const mockSignOut = vi.fn();
let mockUser: { name: string } | null = null;

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('@/features/auth/hooks/useSignOutAction', () => ({
  useSignOutAction: () => ({ signOut: mockSignOut }),
}));

vi.mock('@/components/ui/Sheet', () => ({
  Sheet: ({ children, open }: { children: React.ReactNode; open?: boolean }) => (
    <div data-testid="mock-sheet" data-open={open ?? true}>
      {children}
    </div>
  ),
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        <button type="button" aria-label="Close">
          Close
        </button>
        {children}
      </div>
    );
  },
  SheetClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/Select', () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange?: (val: string) => void;
  }) => (
    <div
      data-testid="mock-select"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const item = target.closest('[data-value]');
        if (item && onValueChange) {
          onValueChange((item as HTMLElement).dataset.value || '');
        }
      }}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  SelectValue: () => <span>ENG</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`select-item-${value}`} data-value={value} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  ),
  SelectLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectSeparator: () => <hr />,
  SelectScrollUpButton: () => null,
  SelectScrollDownButton: () => null,
}));

describe('Header & Navigation System (with Real UI Components)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    window.innerWidth = 1024;
    window.scrollY = 0;
  });

  describe('Header Component', () => {
    it('should render the logo inside header', () => {
      render(<Header />);
      const logos = screen.getAllByRole('link', { name: /SwaggerEditor/i });
      expect(logos.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Component', () => {
    it('should show only public links when user is guest', () => {
      render(<Navigation />);
      expect(screen.getByRole('link', { name: 'aboutNav' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'historyNav' })).not.toBeInTheDocument();
    });

    it('should show history link when user is authenticated', () => {
      mockUser = { name: 'John Doe' };
      render(<Navigation />);
      expect(screen.getByRole('link', { name: 'aboutNav' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'historyNav' })).toBeInTheDocument();
    });
  });

  describe('UserActions Component', () => {
    it('should show Sign In and Sign Up buttons for guest user', () => {
      render(<UserActions />);
      expect(screen.getByRole('link', { name: 'signIn' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'signUp' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'signOut' })).not.toBeInTheDocument();
    });

    it('should show Sign Out button and trigger action on click when authenticated', () => {
      mockUser = { name: 'John Doe' };
      render(<UserActions />);

      const signOutButton = screen.getByRole('button', { name: 'signOut' });
      expect(signOutButton).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'signIn' })).not.toBeInTheDocument();

      fireEvent.click(signOutButton);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('SelectLanguage Component', () => {
    it('should display selected language value and available options', () => {
      render(<SelectLanguage />);

      expect(screen.getAllByText('ENG')[0]).toBeInTheDocument();
      expect(screen.getByText('RUS')).toBeInTheDocument();
      expect(screen.getByText('BEL')).toBeInTheDocument();
      expect(screen.getByText('UKR')).toBeInTheDocument();
    });

    it('should call router.replace with correct arguments when language is changed', () => {
      render(<SelectLanguage />);

      const russianOption = screen.getByTestId('select-item-ru');
      fireEvent.click(russianOption);

      expect(mockReplace).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith('/about', {
        locale: 'ru',
      });
    });
  });

  describe('Header Side Effects (Resize & Scroll)', () => {
    it('should close mobile menu when close button inside the menu is clicked', () => {
      render(<Header />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
      const sheetContainer = screen.getByTestId('mock-sheet');

      fireEvent.click(closeButton);

      expect(sheetContainer).toHaveAttribute('data-open', 'false');
    });

    it('should close mobile menu when window resizes to desktop width (>= 768px)', () => {
      window.innerWidth = 375;
      render(<Header />);

      window.innerWidth = 768;
      fireEvent(window, new Event('resize'));

      const desktopContainer = screen.queryByRole('navigation', { name: 'mobile-nav' });
      expect(desktopContainer).not.toBeInTheDocument();
    });

    it('should set scrolled to true when window scrolls down past 50px', () => {
      render(<Header />);
      const headerElement = screen.getByRole('banner');

      expect(headerElement).toHaveClass('py-4');
      expect(headerElement).not.toHaveClass('py-2');

      window.scrollY = 60;
      fireEvent(window, new Event('scroll'));

      expect(headerElement).toHaveClass('py-2');
    });

    it('should set scrolled to false when window scrolls back up to <= 15px', () => {
      render(<Header />);
      const headerElement = screen.getByRole('banner');

      window.scrollY = 100;
      fireEvent(window, new Event('scroll'));
      expect(headerElement).toHaveClass('py-2');

      window.scrollY = 10;
      fireEvent(window, new Event('scroll'));

      expect(headerElement).toHaveClass('py-4');
    });
  });
});
