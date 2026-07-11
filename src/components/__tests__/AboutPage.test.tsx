/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react';
import type { ImageProps } from 'next/image';
import { describe, expect, it, vi } from 'vitest';

import AboutPage from '@/app/[locale]/about/page';
import AboutCourse from '@/components/about/AboutCourse';
import AboutIntro from '@/components/about/AboutIntro';
import AboutTeam from '@/components/about/AboutTeam';
import AboutTechStack from '@/components/about/AboutTechStack';
import { TEAM } from '@/components/about/teamInfo';
import { TECH_STACK } from '@/components/about/techStack';
import type { TFunction } from '@/types/translation';

vi.mock('next/image', () => ({
  default: (props: ImageProps) => {
    const { src, alt, width, height, className } = props;
    const imgSrc = typeof src === 'string' ? src : '';
    return <img src={imgSrc} alt={alt} width={width} height={height} className={className} />;
  },
}));

const mockT = ((key: string) => key) as unknown as TFunction;
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue(((key: string) => key) as unknown as TFunction),
}));

describe('About Page Components', () => {
  describe('AboutIntro', () => {
    it('should correctly render title and description', () => {
      render(<AboutIntro t={mockT} />);

      expect(screen.getByText('title')).toBeInTheDocument();
      expect(screen.getByText('desc')).toBeInTheDocument();
    });
  });

  describe('AboutCourse', () => {
    it('should render course info and external link', () => {
      render(<AboutCourse t={mockT} />);

      expect(screen.getByText('RSS.title')).toBeInTheDocument();
      expect(screen.getByText('RSS.desc')).toBeInTheDocument();

      const link = screen.getByRole('link', { name: 'RSS.linkAria' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    });
  });

  describe('AboutTechStack', () => {
    it('should render title and all technologies from the stack', () => {
      render(<AboutTechStack t={mockT} />);

      expect(screen.getByText('tech.title')).toBeInTheDocument();

      TECH_STACK.forEach((tech) => {
        expect(screen.getByText(`tech.items.${tech.label}`)).toBeInTheDocument();
        expect(screen.getByText(tech.value)).toBeInTheDocument();
      });
    });
  });

  describe('AboutTeam', () => {
    it('should render team title and cards for all team members', () => {
      render(<AboutTeam t={mockT} />);

      expect(screen.getByText('team.title')).toBeInTheDocument();

      TEAM.forEach((member) => {
        expect(screen.getByText(`team.${member.name}`)).toBeInTheDocument();
        expect(screen.getByText(`team.${member.role}`)).toBeInTheDocument();

        const githubLink = screen.getByRole('link', { name: `team.${member.ariaLabel}` });
        expect(githubLink).toHaveAttribute('href', member.githubLink);
      });
    });
  });

  describe('About Page', () => {
    it('should correctly resolve params and render all child components together', async () => {
      const mockParams = Promise.resolve({ locale: 'en' });
      const AboutPageJSX = await AboutPage({ params: mockParams });

      render(AboutPageJSX);

      expect(screen.getByText('title')).toBeInTheDocument();
      expect(screen.getByText('RSS.title')).toBeInTheDocument();
      expect(screen.getByText('tech.title')).toBeInTheDocument();
      expect(screen.getByText('team.title')).toBeInTheDocument();
    });
  });
});
