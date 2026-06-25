import type { JSX } from 'react/jsx-runtime';

import type { ButtonSize } from '@/constants/ui-variants';
import { btnSizes, linkVariants } from '@/constants/ui-variants';

import type { IconSize, IconVersion } from './Icon';
import Icon from './Icon';

interface ExternalLinkProps {
  href: string;
  name: string;
  ariaLabel: string;
  icon?: IconVersion;
  iconSize?: IconSize;
  iconPosition?: 'left' | 'right';
  linkVersion: 'regular' | 'secondary';
  linkSize: ButtonSize;
  className?: string;
}

const ExternalLink = ({
  href,
  name,
  ariaLabel,
  icon,
  iconSize = 'xs',
  iconPosition = 'left',
  linkVersion,
  linkSize,
  className = '',
}: ExternalLinkProps): JSX.Element => {
  const linkClasses = [
    linkVariants[linkVersion],
    btnSizes[linkSize],
    'inline-flex items-center justify-center gap-2',
    iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      href={href}
      className={linkClasses}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      {icon && <Icon name={icon} size={iconSize} />}
      <span>{name}</span>
    </a>
  );
};

export default ExternalLink;
