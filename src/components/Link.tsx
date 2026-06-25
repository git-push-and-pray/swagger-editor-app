import type { JSX } from 'react/jsx-runtime';

import type { ButtonSize, LinkVersion } from '@/constants/ui-variants';
import { btnSizes, linkVariants } from '@/constants/ui-variants';
import { Link } from '@/i18n/navigation';

import type { IconSize, IconVersion } from './Icon';
import Icon from './Icon';

interface LinkProps {
  href: string;
  name: string;
  icon?: IconVersion;
  iconSize?: IconSize;
  iconPosition?: 'left' | 'right';
  hideTextOnMobile?: boolean;
  linkVersion: LinkVersion;
  linkSize: ButtonSize;
  className?: string;
}

const LinkComponent = ({
  href,
  name,
  icon,
  iconSize = 's',
  iconPosition = 'left',
  hideTextOnMobile = true,
  linkVersion,
  linkSize,
  className = '',
}: LinkProps): JSX.Element => {
  const linkClasses = [
    linkVariants[linkVersion],
    btnSizes[linkSize],
    'inline-flex items-center justify-center gap-2',
    iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const textClasses = icon && hideTextOnMobile ? 'sr-only sm:not-sr-only sm:inline' : '';
  return (
    <Link href={href} className={linkClasses}>
      {icon && <Icon name={icon} size={iconSize} />}
      <span className={textClasses}>{name}</span>
    </Link>
  );
};

export default LinkComponent;
