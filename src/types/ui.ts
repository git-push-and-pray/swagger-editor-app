import type { MouseEventHandler } from 'react';

import type { IconSize, IconVersion } from '@/components/ui/Icon';
import type { ButtonSize, ButtonVersion, LinkVersion } from '@/config/buttonConfig';

interface BaseControlProps {
  name: string;

  icon?: IconVersion;
  iconSize?: IconSize;
  iconPosition?: 'left' | 'right';
  hideTextOnMobile?: boolean;

  size: ButtonSize;
  className?: string;
}

export interface ButtonProps extends BaseControlProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  btnVersion: ButtonVersion;
}

export interface LinkProps extends BaseControlProps {
  href: string;
  linkVersion: LinkVersion;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export interface ExternalLinkProps extends BaseControlProps {
  href: string;
  ariaLabel: string;
  linkVersion: 'regular' | 'secondary';
}
