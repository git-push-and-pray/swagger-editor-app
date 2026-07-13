import type { JSX } from 'react/jsx-runtime';

import { uiConfig } from '@/config/buttonConfig';
import { Link } from '@/i18n/navigation';
import type { LinkProps } from '@/types/ui';

import Icon from './Icon';

const LinkComponent = ({
  href,
  name,
  icon,
  iconSize = 's',
  iconPosition = 'left',
  hideTextOnMobile = true,
  linkVersion,
  size,
  className = '',
  onClick,
}: LinkProps): JSX.Element => {
  const linkClasses = [
    uiConfig.link.variants[linkVersion],
    uiConfig.button.sizes[size],
    uiConfig.common.layout,
    iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const textClasses = icon && hideTextOnMobile ? 'sr-only sm:not-sr-only sm:inline' : '';
  return (
    <Link href={href} className={linkClasses} onClick={onClick}>
      {icon && <Icon name={icon} size={iconSize} />}
      <span className={textClasses}>{name}</span>
    </Link>
  );
};

export default LinkComponent;
