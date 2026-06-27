import type { JSX } from 'react/jsx-runtime';

import { uiConfig } from '@/config/buttonConfig';
import type { ExternalLinkProps } from '@/types/ui';

import Icon from './Icon';

const ExternalLink = ({
  href,
  name,
  ariaLabel,
  icon,
  iconSize = 'xs',
  iconPosition = 'left',
  linkVersion,
  size,
  className = '',
}: ExternalLinkProps): JSX.Element => {
  const linkClasses = [
    uiConfig.link.variants[linkVersion],
    uiConfig.button.sizes[size],
    uiConfig.common.layout,
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
